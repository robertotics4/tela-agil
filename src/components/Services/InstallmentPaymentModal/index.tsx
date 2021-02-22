import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { useLoading } from 'react-use-loading';
import * as Yup from 'yup';

import getValidationErrors from '../../../utils/getValidationErrors';
import getUnformattedPhone from '../../../utils/getUnformattedPhone';

import { useCustomerService } from '../../../hooks/customerService';
import { useToast } from '../../../hooks/toast';
import { useWhatsappSending } from '../../../hooks/useWhatsappSending';

import Loading from '../../Loading';
import Modal from '../../Modal';
import InputMask from '../../InputMask';

import { currencyMask } from '../../../utils/inputMasks';

import { ModalContent, SendButton, CodeBarContent } from './styles';

import { InstallmentDebit } from '../../../types/Debits';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

interface SendDebitFormData {
  phone: string;
}

const InstallmentPaymentModal: React.FC<ModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [selectedInstallmentDebit, setSelectedInstallmentDebit] = useState<
    InstallmentDebit | undefined
  >(undefined);

  const [codeBarValue, setCodeBarValue] = useState('');

  const { debits, customer, operatingCompany } = useCustomerService();
  const { addToast } = useToast();
  const { sendInstallmentPayment } = useWhatsappSending();
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

        if (selectedInstallmentDebit) {
          await sendInstallmentPayment({
            operatingCompany,
            phoneNumber: getUnformattedPhone(data.phone),
            name: customer.name,
            amount: selectedInstallmentDebit.invoiceAmount,
            barCode: selectedInstallmentDebit.paymentCode,
            contract: customer.contractAccount,
          });

          addToast({
            type: 'success',
            title: 'Fatura enviada',
            description: 'Fatura foi enviada com sucesso.',
          });
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
        setIsOpen();
        stop();
      }
    },
    [
      addToast,
      selectedInstallmentDebit,
      customer,
      operatingCompany,
      start,
      sendInstallmentPayment,
      stop,
      setIsOpen,
    ],
  );

  const handleClickInstallmentDebit = useCallback((debit: InstallmentDebit) => {
    setSelectedInstallmentDebit(debit);
    setCodeBarValue(debit.paymentCode);
  }, []);

  const generateInstallmentRows = useMemo(() => {
    const installmentRows = debits.installmentDebits.installmentDebitDetails.map(
      debit => (
        <tr
          key={debit.billingDocumentNumber}
          tabIndex={0}
          onClick={() => handleClickInstallmentDebit(debit)}
        >
          <td>
            <span>Nº do documento</span>
            <strong>{debit.billingDocumentNumber}</strong>
          </td>
          <td>
            <h2>{currencyMask(debit.invoiceAmount)}</h2>
          </td>
        </tr>
      ),
    );

    return installmentRows;
  }, [debits, handleClickInstallmentDebit]);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      {debits.installmentDebits.installmentDebitDetails.length ? (
        <ModalContent>
          <h2>Entrada de parcelamento</h2>

          <div>
            <table>
              <tbody>{generateInstallmentRows}</tbody>
            </table>
          </div>

          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            initialData={{
              phone: customer.contacts.phones?.cellPhone,
            }}
          >
            {codeBarValue ? (
              <CodeBarContent>
                <span>Código para pagamento</span>
                <strong>{codeBarValue}</strong>
              </CodeBarContent>
            ) : (
              <span>Nenhum documento selecionado</span>
            )}

            <InputMask
              name="phone"
              mask="(99) 99999-9999"
              type="text"
              placeholder="Telefone do cliente"
              autoComplete="off"
            />

            <SendButton type="submit">Enviar código</SendButton>
          </Form>
        </ModalContent>
      ) : (
        <p>O cliente não possui negociações.</p>
      )}

      {isLoading && (
        <Loading isOpen={isLoading} message={message} setIsOpen={stop} />
      )}
    </Modal>
  );
};

export default InstallmentPaymentModal;
