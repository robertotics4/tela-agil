import React, { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import { useLoading } from 'react-use-loading';

import Loading from '../../Loading';
import Modal from '../../Modal';

import {
  ModalContent,
  SelectDate,
  ConfirmButton,
  SelectContainer,
} from './styles';

import { useCustomerService } from '../../../hooks/customerService';
import { useChangeDueDateService } from '../../../hooks/changeDueDateService';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

interface OptionProps {
  value: string;
  label: string;
}

const DueDateChange: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const [
    { isLoading, message },
    { start: startLoading, stop: stopLoading },
  ] = useLoading();

  const {
    customer,
    operatingCompany,
    registerServicePerformed,
  } = useCustomerService();

  const { validDueDates, setDueDate } = useChangeDueDateService();

  const [selectOptions, setSelectOptions] = useState<OptionProps[]>([]);
  const [selectedDate, setSelectedDate] = useState<OptionProps | undefined>(
    undefined,
  );

  const handleChangeSelect = useCallback((value: OptionProps) => {
    setSelectedDate(value);
  }, []);

  const handleClickSetDueDate = useCallback(async () => {
    try {
      startLoading('Alterando Data Certa ...');

      if (selectedDate) {
        await setDueDate({
          contractAccount: customer.contractAccount,
          stateCode: operatingCompany,
          requestedDate: selectedDate.value,
        });

        Swal.fire({
          icon: 'success',
          title: 'Data Certa',
          html: '<p>Data certa alterada com sucesso.</p>',
          confirmButtonText: `OK`,
          confirmButtonColor: '#3c1490',
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Data Certa',
        html: `<p>${err.message}</p>`,
        confirmButtonText: `OK`,
        confirmButtonColor: '#3c1490',
      });
    } finally {
      setIsOpen();
      stopLoading();
    }
  }, [
    selectedDate,
    setDueDate,
    setIsOpen,
    startLoading,
    stopLoading,
    customer,
    operatingCompany,
  ]);

  useEffect(() => {
    setSelectOptions(
      validDueDates.map(date => {
        const option: OptionProps = {
          value: date.description,
          label: date.code,
        };

        return option;
      }),
    );
  }, [validDueDates]);

  useEffect(() => {
    if (isOpen) {
      setSelectedDate(undefined);

      registerServicePerformed({
        serviceName: 'Alteração de Data Certa',
        executionDate: new Date(),
      });
    }
  }, [registerServicePerformed, isOpen]);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalContent>
        <h2>Data certa</h2>

        <h1>Escolha a melhor data para você receber suas próximas faturas:</h1>

        <SelectContainer>
          <SelectDate
            name="dueDate"
            options={[...selectOptions]}
            maxMenuHeight={144}
            placeholder="Selecione"
            onChange={(value: OptionProps) => handleChangeSelect(value)}
          />

          <ConfirmButton
            type="button"
            onClick={handleClickSetDueDate}
            disabled={!selectedDate}
          >
            Cadastrar
          </ConfirmButton>
        </SelectContainer>
      </ModalContent>

      {isLoading && (
        <Loading isOpen={isLoading} message={message} setIsOpen={stopLoading} />
      )}
    </Modal>
  );
};

export default DueDateChange;
