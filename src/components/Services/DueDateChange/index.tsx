import React, { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { useLoading } from 'react-use-loading';

import eqtlBarApi from '../../../services/eqtlBarApi';

import Loading from '../../Loading';
import Modal from '../../Modal';

import {
  ModalContent,
  SelectDate,
  ConfirmButton,
  SelectContainer,
} from './styles';

import { useCustomerService } from '../../../hooks/customerService';
import { useAlert } from '../../../hooks/alert';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

interface ValidDate {
  description: string;
  code: string;
}

interface ResponseValidDate {
  descricaoDt: string;
  codigoDt: string;
}

interface GetDueDateListProps {
  contract: string;
  stateCode: string;
}

interface SetDueDateProps {
  contract: string;
  stateCode: string;
  requestedDate: string;
}

interface OptionProps {
  value: string;
  label: string;
}

const DueDateChange: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const [{ isLoading, message }, { start, stop }] = useLoading();

  const {
    customer,
    operatingCompany,
    registerServicePerformed,
  } = useCustomerService();
  const { customAlert } = useAlert();

  const [validDates, setValidDates] = useState<ValidDate[]>([]);
  const [selectOptions, setSelectOptions] = useState<OptionProps[]>([]);
  const [selectedDate, setSelectedDate] = useState<OptionProps | undefined>(
    undefined,
  );

  const getDueDateList = useCallback(
    async ({ contract, stateCode }: GetDueDateListProps) => {
      const response = await eqtlBarApi.get('/servico/v1/dataCerta', {
        params: {
          contaContrato: contract,
          empresaOperadora: stateCode,
          flagConsultar: true,
          codigoTransacao: uuid(),
          canalAtendimento: 'S',
        },
      });

      return response.data.data.listaDataCerta;
    },
    [],
  );

  const setDueDate = useCallback(
    async ({ contract, stateCode, requestedDate }: SetDueDateProps) => {
      const response = await eqtlBarApi.get('/servico/v1/dataCerta', {
        params: {
          contaContrato: contract,
          empresaOperadora: stateCode,
          flagAlterar: true,
          dataSolicitada: requestedDate,
          codigoTransacao: uuid(),
          canalAtendimento: 'S',
        },
      });

      if (response.data.data.mensagem !== 'Data Certa Incluida com Sucesso!') {
        throw new Error(response.data.data.mensagem);
      }
    },
    [],
  );

  const handleChangeSelect = useCallback((value: OptionProps) => {
    setSelectedDate(value);
  }, []);

  const handleClickSetDueDate = useCallback(async () => {
    try {
      start('Ativando serviço ...');

      if (selectedDate) {
        await setDueDate({
          contract: customer.contractAccount,
          stateCode: operatingCompany,
          requestedDate: selectedDate.value,
        });

        customAlert({
          type: 'success',
          title: 'Sucesso na alteração',
          description: 'Data certa alterada com sucesso.',
          confirmationText: 'OK',
        });
      }
    } catch (err) {
      customAlert({
        type: 'error',
        title: 'Erro na alteração',
        description: err.message,
        confirmationText: 'OK',
      });
    } finally {
      setIsOpen();
      stop();
    }
  }, [
    customAlert,
    selectedDate,
    setDueDate,
    setIsOpen,
    start,
    stop,
    customer,
    operatingCompany,
  ]);

  useEffect(() => {
    getDueDateList({
      contract: customer.contractAccount,
      stateCode: operatingCompany,
    }).then(data => {
      setValidDates(
        data.map((date: ResponseValidDate) => {
          const validDate: ValidDate = {
            description: date.descricaoDt,
            code: date.codigoDt,
          };

          return validDate;
        }),
      );
    });
  }, [customer, getDueDateList, operatingCompany]);

  useEffect(() => {
    setSelectOptions(
      validDates.map(date => {
        const option: OptionProps = {
          value: date.description,
          label: date.code,
        };

        return option;
      }),
    );
  }, [validDates]);

  useEffect(() => {
    setSelectedDate(undefined);
  }, [setIsOpen]);

  useEffect(() => {
    registerServicePerformed({
      serviceName: 'Alteração de Data Certa',
      executionDate: new Date(),
    });
  }, [registerServicePerformed]);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      {validDates.length ? (
        <ModalContent>
          <h2>Data certa</h2>

          <h1>
            Escolha a melhor data para você receber suas próximas faturas:
          </h1>

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
      ) : (
        <p>Data certa não habilitada para o cliente</p>
      )}

      {isLoading && (
        <Loading isOpen={isLoading} message={message} setIsOpen={stop} />
      )}
    </Modal>
  );
};

export default DueDateChange;
