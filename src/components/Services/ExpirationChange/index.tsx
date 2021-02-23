import React, { useCallback, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { useLoading } from 'react-use-loading';

import Select from 'react-select';
import { useToast } from '../../../hooks/toast';
import eqtlBarApi from '../../../services/eqtlBarApi';

import Loading from '../../Loading';
import Modal from '../../Modal';

import {
  ModalContent,
  SelectContainer,
  SelectDate,
  ConfirmButton,
} from './styles';
import { useCustomerService } from '../../../hooks/customerService';

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

interface GetDateListProps {
  contract: string;
  stateCode: string;
}

interface OptionProps {
  value: string;
  label: string;
}

const ExpirationChange: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const [{ isLoading, message }, { start, stop }] = useLoading();

  const { customer, operatingCompany } = useCustomerService();
  const { addToast } = useToast();

  const [validDates, setValidDates] = useState<ValidDate[]>([]);
  const [selectOptions, setSelectOptions] = useState<OptionProps[]>([]);
  const [selectedDate, setSelectedDate] = useState<ValidDate | undefined>(
    undefined,
  );

  const getDateList = useCallback(
    async ({ contract, stateCode }: GetDateListProps) => {
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

  const handleChangeSelect = useCallback((value: ValidDate) => {
    setSelectedDate(value);
  }, []);

  useEffect(() => {
    getDateList({
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
  }, [customer, getDateList, operatingCompany]);

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

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalContent>
        <h2>Data certa</h2>

        <h1>Escolha a melhor data para você receber suas próximas faturas:</h1>

        <SelectContainer>
          <SelectDate
            options={[...selectOptions]}
            maxMenuHeight={144}
            placeholder="Selecione"
            onChange={(value: ValidDate) => handleChangeSelect(value)}
          />

          <ConfirmButton type="button">Cadastrar</ConfirmButton>
        </SelectContainer>
      </ModalContent>

      {isLoading && (
        <Loading isOpen={isLoading} message={message} setIsOpen={stop} />
      )}
    </Modal>
  );
};

export default ExpirationChange;
