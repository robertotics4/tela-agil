import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { format } from 'date-fns';

import { useCustomerService } from '../../../hooks/customerService';

import Modal from '../../Modal';
import InputMask from '../../InputMask';

import { currencyMask } from '../../../utils/inputMasks';

import { ModalContent, SendButton } from './styles';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

interface SendDebitFormData {
  username: string;
  password: string;
}

const DebitsConsultationModal: React.FC<ModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const { debits } = useCustomerService();

  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback((data: SendDebitFormData) => {
    console.log(data);
  }, []);

  const generateInstallmentRows = useMemo(() => {
    const installmentRows = debits.installmentDebits.installmentDebitDetails.map(
      debit => (
        <tr tabIndex={0}>
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
  }, [debits]);

  const generateInvoiceRows = useMemo(() => {
    const invoiceRows = debits.invoiceDebits.invoiceDebitDetails.map(debit => (
      <tr tabIndex={0}>
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
  }, [debits]);

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

        <Form ref={formRef} onSubmit={handleSubmit}>
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
