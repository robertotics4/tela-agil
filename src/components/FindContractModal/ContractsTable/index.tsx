import React, { useCallback } from 'react';
import { useLoading } from 'react-use-loading';

import { Container, RCTable } from './styles';
import { useCustomerService } from '../../../hooks/customerService';
import { useAlert } from '../../../hooks/alert';

import Loading from '../../Loading';

interface Contract {
  contractAccount: string;
  address: string;
}

interface TableProps {
  data: Contract[];
  closeModal(): void;
}

const ContractsTable: React.FC<TableProps> = ({ data, closeModal }) => {
  const { customAlert } = useAlert();
  const [
    { isLoading, message },
    { start: startLoading, stop: stopLoading },
  ] = useLoading();

  const { startService, operatingCompany } = useCustomerService();

  const columns = [
    {
      title: 'Conta contrato',
      dataIndex: 'contractAccount',
      key: 'contractAccount',
    },
    {
      title: 'Endereço',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const onRowClick = useCallback(
    async (record, index, event) => {
      try {
        startLoading('Iniciando atendimento ...');

        if (record.contractAccount) {
          await startService({
            stateCode: operatingCompany,
            contractAccount: record.contractAccount,
          });
        }
      } catch (err) {
        customAlert({
          type: 'error',
          title: 'Erro no atendimento',
          description: 'Não foi iniciar o atendimento.',
          confirmationText: 'OK',
        });
      } finally {
        closeModal();
        stopLoading();
      }
    },
    [
      closeModal,
      customAlert,
      operatingCompany,
      startService,
      startLoading,
      stopLoading,
    ],
  );

  return (
    <Container>
      <RCTable
        columns={columns}
        data={data}
        tableLayout="auto"
        rowKey="contractAccount"
        onRow={(record, index) => ({
          onClick: onRowClick.bind(null, record, index),
        })}
      />

      {isLoading && (
        <Loading isOpen={isLoading} message={message} setIsOpen={stopLoading} />
      )}
    </Container>
  );
};

export default ContractsTable;
