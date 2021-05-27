import React, { createContext, useCallback, useContext, useState } from 'react';
import { v4 as uuid } from 'uuid';

import addZeroesToNumber from '../utils/addZeroesToNumber';
import eqtlBarApi from '../services/eqtlBarApi';

interface ChangeDueDateServiceContextData {
  validDueDates: ValidDate[];
  ableToChangeDueDate({
    contractAccount,
    stateCode,
  }: AbleToChangeDueDateProps): Promise<AbleToChangeDueDateResponse>;
  getDueDateList({
    contractAccount,
    stateCode,
  }: GetDueDateListProps): Promise<ValidDate[]>;
  setDueDate({
    contractAccount,
    stateCode,
    requestedDate,
  }: SetDueDateProps): Promise<void>;
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
  contractAccount: string;
  stateCode: string;
}

interface SetDueDateProps {
  contractAccount: string;
  stateCode: string;
  requestedDate: string;
}

interface AbleToChangeDueDateProps {
  contractAccount: string;
  stateCode: string;
}

interface AbleToChangeDueDateResponse {
  ok: boolean;
  error?: string;
}

const ChangeDueDateServiceContext = createContext<ChangeDueDateServiceContextData>(
  {} as ChangeDueDateServiceContextData,
);

const ChangeDueDateServiceProvider: React.FC = ({ children }) => {
  const [validDueDates, setValidDueDates] = useState<ValidDate[]>([]);

  const getDueDateList = useCallback(
    async ({ contractAccount, stateCode }: GetDueDateListProps) => {
      const response = await eqtlBarApi.get('/servico/v1/dataCerta', {
        params: {
          contaContrato: addZeroesToNumber(contractAccount, 12),
          empresaOperadora: stateCode,
          flagConsultar: true,
          codigoTransacao: uuid(),
          canalAtendimento: 'S',
        },
      });

      if (!response.data.data.listaDataCerta.length) {
        throw new Error(response.data.data.mensagem.trim());
      }

      const dueDates: ValidDate[] = response.data.data.listaDataCerta.map(
        (date: ResponseValidDate) => {
          const validDate: ValidDate = {
            description: date.descricaoDt,
            code: date.codigoDt,
          };

          return validDate;
        },
      );

      setValidDueDates(dueDates);

      return dueDates;
    },
    [],
  );

  const setDueDate = useCallback(
    async ({ contractAccount, stateCode, requestedDate }: SetDueDateProps) => {
      const response = await eqtlBarApi.get('/servico/v1/dataCerta', {
        params: {
          contaContrato: addZeroesToNumber(contractAccount, 12),
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

  const ableToChangeDueDate = useCallback(
    async ({ contractAccount, stateCode }: AbleToChangeDueDateProps) => {
      try {
        await getDueDateList({
          contractAccount: addZeroesToNumber(contractAccount, 12),
          stateCode,
        });

        return { ok: true };
      } catch (err) {
        return { ok: false, error: err.message };
      }
    },
    [getDueDateList],
  );

  return (
    <ChangeDueDateServiceContext.Provider
      value={{ validDueDates, ableToChangeDueDate, getDueDateList, setDueDate }}
    >
      {children}
    </ChangeDueDateServiceContext.Provider>
  );
};

function useChangeDueDateService(): ChangeDueDateServiceContextData {
  const context = useContext(ChangeDueDateServiceContext);

  if (!context) {
    throw new Error(
      'useChangeDueDateService must be used within an ChangeDueDateServiceProvider',
    );
  }

  return context;
}

export { ChangeDueDateServiceProvider, useChangeDueDateService };
