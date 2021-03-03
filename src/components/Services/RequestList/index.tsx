import React, { useMemo } from 'react';
import { useLoading } from 'react-use-loading';
import { format } from 'date-fns';
import { Column, ColumnInstance, ColumnInterface } from 'react-table';
import { useCustomerService } from '../../../hooks/customerService';

import Loading from '../../Loading';
import Modal from '../../Modal';
import Table from './ServiceNotesTable';

import { ClosedNote, OpenNote } from '../../../types/ServiceNotes';

import { ModalContent, OpeningDate, Title } from './styles';

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
  const [{ isLoading, message }, { start, stop }] = useLoading();
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
          status: 'Concluído',
        } as Note),
    );

    return [...mappedOpenNotes, ...mappedClosedNotes];
  }, [serviceNotes]);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalContent>
        <Title>Acompanhamento de protocolos</Title>

        <Table columns={columns} data={data} />
      </ModalContent>

      {isLoading && (
        <Loading isOpen={isLoading} message={message} setIsOpen={stop} />
      )}
    </Modal>
  );
};

export default RequestList;
