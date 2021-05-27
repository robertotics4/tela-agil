import React, { useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { Column } from 'react-table';
import { useCustomerService } from '../../../hooks/customerService';

import Modal from '../../Modal';
import Table from './ProtocolsTable';
import StatusIndicator from '../../StatusIndicator';

import Protocol from '../../../types/Protocol';

import { ModalContent, Title } from './styles';
import { useMonitoringOfProtocols } from '../../../hooks/monitoringOfProtocols';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

const MonitoringOfProtocols: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const { registerServicePerformed } = useCustomerService();
  const { protocols } = useMonitoringOfProtocols();

  const columns: Column<Protocol>[] = useMemo(
    () =>
      [
        {
          Header: 'Número',
          accessor: 'number',
        },
        {
          Header: 'Serviço',
          accessor: 'service',
        },
        {
          Header: 'Solicitado em',
          accessor: 'requestDate',
          Cell: ({ value }) => format(value, 'dd/MM/yyyy'),
        },
        {
          Header: 'Status',
          accessor: 'status',
          Cell: ({ value }) => {
            if (value === 'Aberto') {
              return <StatusIndicator type="open" title="Aberto" />;
            }

            if (value === 'Concluido') {
              return <StatusIndicator type="concluded" title="Concluído" />;
            }

            if (value === 'Cancelado') {
              return <StatusIndicator type="canceled" title="Cancelado" />;
            }

            return '-';
          },
        },
      ] as Column<Protocol>[],
    [],
  );

  useEffect(() => {
    if (isOpen) {
      registerServicePerformed({
        serviceName: 'Acompanhamento de Protocolos',
        executionDate: new Date(),
      });
    }
  }, [registerServicePerformed, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      customStyles={{
        borderRadius: '8px',
        padding: '48px 0',
        width: 'fit-content',
        height: 'fit-content',
      }}
    >
      <ModalContent>
        <Title>Acompanhamento de Protocolos</Title>

        <Table columns={columns} data={protocols} />
      </ModalContent>
    </Modal>
  );
};

export default MonitoringOfProtocols;
