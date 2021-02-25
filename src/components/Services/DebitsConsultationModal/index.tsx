import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { format } from 'date-fns';
import { useLoading } from 'react-use-loading';
import * as Yup from 'yup';

import getValidationErrors from '../../../utils/getValidationErrors';
import getUnformattedPhone from '../../../utils/getUnformattedPhone';

import { useCustomerService } from '../../../hooks/customerService';
import { useToast } from '../../../hooks/toast';
import { useDebitsConsultation } from '../../../hooks/debitsConsultation';
import { useWhatsappSending } from '../../../hooks/useWhatsappSending';

import Loading from '../../Loading';
import Modal from '../../Modal';
import InputMask from '../../InputMask';

import { currencyMask } from '../../../utils/inputMasks';

import { InstallmentDebit, InvoiceDebit } from '../../../types/Debits';
import { ModalContent, SendButton, DebitContainer } from './styles';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

interface SendDebitFormData {
  phone: string;
}

const DebitsConsultationModal: React.FC<ModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [selectedDebit, setSelectedDebit] = useState<
    InstallmentDebit | InvoiceDebit | undefined
  >(undefined);

  const { debits, customer, operatingCompany } = useCustomerService();
  const { addToast } = useToast();
  const { getInvoiceUrl } = useDebitsConsultation();
  const { sendInvoiceDebit, sendInstallmentPayment } = useWhatsappSending();
  const [{ isLoading, message }, { start, stop }] = useLoading();

  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: SendDebitFormData) => {
      try {
        start('Enviando fatura ...');

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          phone: Yup.string().required('Telefone obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (selectedDebit) {
          if (Object.keys(selectedDebit).includes('overdueInvoiceNumber')) {
            const invoiceUrl = await getInvoiceUrl({
              invoiceReference: selectedDebit.invoiceReference,
              operatingCompany,
            });

            console.log(invoiceUrl);

            if (invoiceUrl) {
              await sendInvoiceDebit({
                invoiceUrl,
                operatingCompany,
                phoneNumber: getUnformattedPhone(data.phone),
              });

              addToast({
                type: 'success',
                title: 'Fatura enviada',
                description: 'Fatura foi enviada com sucesso.',
              });
            }

            return;
          }

          if (Object.keys(selectedDebit).includes('billingDocumentNumber')) {
            await sendInstallmentPayment({
              operatingCompany,
              phoneNumber: getUnformattedPhone(data.phone),
              name: customer.name,
              amount: selectedDebit.invoiceAmount,
              barCode: selectedDebit.paymentCode,
              contract: customer.contractAccount,
            });

            addToast({
              type: 'success',
              title: 'Código enviado',
              description: 'O código para pagamento foi enviado com sucesso.',
            });
          }
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro no envio',
          description:
            'Ocorreu um erro ao enviar a fatura, cheque o número de telefone',
        });
      } finally {
        setSelectedDebit(undefined);
        setIsOpen();
        stop();
      }
    },
    [
      addToast,
      selectedDebit,
      customer,
      getInvoiceUrl,
      operatingCompany,
      start,
      sendInvoiceDebit,
      sendInstallmentPayment,
      stop,
      setIsOpen,
    ],
  );

  const handleClickDebit = useCallback(debit => {
    setSelectedDebit(debit);
  }, []);

  const generateInstallmentRows = useMemo(() => {
    const installmentRows = debits.installmentDebits.installmentDebitDetails.map(
      debit => (
        <tr
          key={debit.billingDocumentNumber}
          tabIndex={0}
          onClick={() => handleClickDebit(debit)}
        >
          <td>
            <span>Parcelamento</span>
          </td>
          <td>
            <h2>{currencyMask(debit.invoiceAmount)}</h2>
          </td>
          <td />
        </tr>
      ),
    );

    return installmentRows;
  }, [debits, handleClickDebit]);

  const generateInvoiceRows = useMemo(() => {
    const invoiceRows = debits.invoiceDebits.invoiceDebitDetails.map(debit => {
      const monthReference = Number(debit.overdueInvoiceNumber.substr(5, 2));
      const yearReference = Number(debit.overdueInvoiceNumber.substr(1, 4));

      const referenceDate = new Date(yearReference, monthReference);

      return (
        <tr
          key={debit.invoiceReference}
          tabIndex={0}
          onClick={() => handleClickDebit(debit)}
        >
          <td>
            <span>Referente a</span>
            <strong>{format(referenceDate, 'MM/yyyy ')}</strong>
          </td>
          <td>
            <h2>{currencyMask(debit.invoiceAmount)}</h2>
          </td>
          <td>
            <span>Vencimento</span>
            <strong>{format(new Date(debit.dueDate), 'dd/MM/yyyy')}</strong>
          </td>
        </tr>
      );
    });

    return invoiceRows;
  }, [debits, handleClickDebit]);

  const selectedDebitReference = useMemo(() => {
    if (selectedDebit) {
      if (Object.keys(selectedDebit).includes('overdueInvoiceNumber')) {
        const invoiceDebit: InvoiceDebit = selectedDebit as InvoiceDebit;

        const monthReference = Number(
          invoiceDebit.overdueInvoiceNumber.substr(5, 2),
        );
        const yearReference = Number(
          invoiceDebit.overdueInvoiceNumber.substr(1, 4),
        );

        const referenceDate = new Date(yearReference, monthReference);

        return format(referenceDate, 'MM/yyyy ');
      }
      return 'Parcelamento';
    }

    return null;
  }, [selectedDebit]);

  useEffect(() => {
    setSelectedDebit(undefined);
  }, [setIsOpen]);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      {debits.installmentDebits.totalAmountInstallmentDebits > 0 ||
      debits.invoiceDebits.totalAmountInvoiceDebits > 0 ? (
        <ModalContent>
          <h2>Consulta de débitos</h2>

          <div>
            <table>
              <tbody>
                {generateInstallmentRows}
                {generateInvoiceRows}
              </tbody>
            </table>
          </div>

          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            initialData={{
              phone: customer.contacts.phones?.cellPhone,
            }}
          >
            {selectedDebit ? (
              <DebitContainer>
                <p>Débito selecionado</p>

                <strong>{`Referente a: ${selectedDebitReference}`}</strong>

                <strong>
                  {`Valor: ${currencyMask(selectedDebit.invoiceAmount)}`}
                </strong>
              </DebitContainer>
            ) : (
              <span>Nenhum débito selecionado</span>
            )}

            <InputMask
              name="phone"
              mask="(99) 99999-9999"
              type="text"
              placeholder="Telefone do cliente"
              autoComplete="off"
            />

            <SendButton type="submit" disabled={!selectedDebit}>
              Enviar fatura
            </SendButton>
          </Form>
        </ModalContent>
      ) : (
        <span>O cliente não possui débitos.</span>
      )}

      {isLoading && (
        <Loading isOpen={isLoading} message={message} setIsOpen={stop} />
      )}
    </Modal>
  );
};

export default DebitsConsultationModal;
