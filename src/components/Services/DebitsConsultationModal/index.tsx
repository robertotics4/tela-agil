import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { format } from 'date-fns';
import * as Yup from 'yup';

import getValidationErrors from '../../../utils/getValidationErrors';

import { useCustomerService } from '../../../hooks/customerService';
import { useToast } from '../../../hooks/toast';
import { useDebitsConsultation } from '../../../hooks/debitsConsultation';

import Modal from '../../Modal';
import InputMask from '../../InputMask';

import { currencyMask } from '../../../utils/inputMasks';

import { ModalContent, SendButton } from './styles';
import { InvoiceDebit } from '../../../types/Debits';

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
  const [selectedDebit, setSelectedDebit] = useState<InvoiceDebit>(
    {} as InvoiceDebit,
  );

  const { debits, customer, operatingCompany } = useCustomerService();
  const { addToast } = useToast();
  const { getInvoiceUrl } = useDebitsConsultation();

  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: SendDebitFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          phone: Yup.string().required('Telefone obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const invoiceUrl = await getInvoiceUrl({
          invoiceReference: selectedDebit.invoiceReference,
          operatingCompany,
        });

        // const invoiceUrl = await getDuplicateInvoiceUrl({
        //   invoiceReference: '310449915839',
        //   operatingCompany: '95',
        // });

        console.log(invoiceUrl);
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
      }
    },
    [addToast, getInvoiceUrl, selectedDebit, operatingCompany],
  );

  const handleClickRow = useCallback(debit => {
    setSelectedDebit(debit);
  }, []);

  const generateInstallmentRows = useMemo(() => {
    const installmentRows = debits.installmentDebits.installmentDebitDetails.map(
      debit => (
        <tr tabIndex={0} onClick={() => handleClickRow(debit)}>
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
  }, [debits, handleClickRow]);

  const generateInvoiceRows = useMemo(() => {
    const invoiceRows = debits.invoiceDebits.invoiceDebitDetails.map(debit => (
      <tr tabIndex={0} onFocus={() => handleClickRow(debit)}>
        <td>
          <span>Referente a</span>
          <strong>-</strong>
        </td>
        <td>
          <h2>{currencyMask(debit.invoiceAmount)}</h2>
        </td>
        <td>
          <span>Vencimento</span>
          <strong>{format(new Date(debit.dueDate), 'dd/MM/yyyy')}</strong>
        </td>
      </tr>
    ));

    return invoiceRows;
  }, [debits, handleClickRow]);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalContent>
        <h2>Consulta de débitos</h2>

        <div>
          <table>
            {generateInstallmentRows}
            {generateInvoiceRows}
          </table>
        </div>

        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          initialData={{
            phone: customer.contacts.phones?.cellPhone,
          }}
        >
          <InputMask
            name="phone"
            mask="(99) 99999-9999"
            type="text"
            placeholder="Telefone"
            autoComplete="off"
          />

          <SendButton type="submit">Enviar fatura</SendButton>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default DebitsConsultationModal;
