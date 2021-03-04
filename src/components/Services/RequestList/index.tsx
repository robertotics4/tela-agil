import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { Column } from 'react-table';
import { useCustomerService } from '../../../hooks/customerService';

import Modal from '../../Modal';
import Table from './ServiceNotesTable';
import StatusIndicator from './StatusIndicator';

import { ClosedNote, OpenNote } from '../../../types/ServiceNotes';

import { ModalContent, Title } from './styles';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

interface Note {
  protocol: string;
  service: string;
  openingDate: string;
  conclusionDate: string | undefined;
  status: string;
}

const RequestList: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const { serviceNotes } = useCustomerService();

  const columns: Column<Note>[] = useMemo(
    () =>
      [
        {
          Header: 'Nº do protocolo',
          accessor: 'protocol',
        },
        {
          Header: 'Serviço',
          accessor: 'service',
        },
        {
          Header: 'Solicitado em',
          accessor: 'openingDate',
        },
        {
          Header: 'Atendido em',
          accessor: 'conclusionDate',
        },
        {
          Header: 'Status',
          accessor: 'status',
          Cell: ({ value }) => {
            if (!value || value === 'FINL') {
              return <StatusIndicator type="concluded" title="Concluído" />;
            }

            if (value === 'AGUA' || value === 'RECE' || value === 'ATIV') {
              return <StatusIndicator type="open" title="Aberto" />;
            }

            if (
              value === 'ECAN' ||
              value === 'CANC' ||
              value === 'ERRO' ||
              value === 'IMPR' ||
              value === 'REJE' ||
              value === 'DEVO'
            ) {
              return <StatusIndicator type="canceled" title="Cancelada" />;
            }

            return null;
          },
        },
      ] as Column<Note>[],
    [],
  );

  const data = useMemo(() => {
    const mappedOpenNotes = serviceNotes.openServiceNotes.map(
      (note: OpenNote) =>
        ({
          protocol: '',
          service: note.typeDescription,
          openingDate: format(note.openingDate, 'dd/MM/yyyy'),
          status: note.status,
        } as Note),
    );

    const mappedClosedNotes = serviceNotes.closedServiceNotes.map(
      (note: ClosedNote) =>
        ({
          protocol: '',
          service: note.typeDescription,
          openingDate: format(note.openingDate, 'dd/MM/yyyy'),
          conclusionDate: format(note.conclusionDate, 'dd/MM/yyyy'),
        } as Note),
    );

    return [...mappedOpenNotes, ...mappedClosedNotes];
  }, [serviceNotes]);

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
        <Title>Acompanhamento de protocolos</Title>

        <Table columns={columns} data={data} />
      </ModalContent>
    </Modal>
  );
};

export default RequestList;
