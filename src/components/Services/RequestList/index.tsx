import React from 'react';
import { useLoading } from 'react-use-loading';
import { format } from 'date-fns';
import { useCustomerService } from '../../../hooks/customerService';

import Loading from '../../Loading';
import Modal from '../../Modal';

import { ClosedNote, OpenNote } from '../../../types/ServiceNotes';

import {
  ModalContent,
  Title,
  RequestListContainer,
  RequestItem,
  Type,
  TypeDescription,
  CodeGroup,
  CodeGroupDescription,
  Code,
  CodeDescription,
  OpeningDate,
  ConclusionDate,
  Status,
  RejectionCode,
  RejectionCodeDescription,
} from './styles';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

const RequestList: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const [{ isLoading, message }, { start, stop }] = useLoading();
  const { serviceNotes } = useCustomerService();

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalContent>
        <Title>Acompanhamento de protocolos</Title>

        <RequestListContainer>
          {serviceNotes.openServiceNotes.map((request: OpenNote) => (
            <RequestItem key={request.code}>
              <Type>{request.type}</Type>

              <TypeDescription>{request.typeDescription}</TypeDescription>

              <CodeGroup>{request.codeGroup}</CodeGroup>

              <CodeGroupDescription>
                {request.codeGroupDescription}
              </CodeGroupDescription>

              <Code>{request.code}</Code>

              <CodeDescription>{request.codeDescription}</CodeDescription>

              <OpeningDate>
                {format(request.openingDate, 'dd/MM/yyyy')}
              </OpeningDate>

              <Status>{request.status}</Status>

              <RejectionCode>{request.rejectionCode}</RejectionCode>

              <RejectionCodeDescription>
                {request.rejectionCodeDescription}
              </RejectionCodeDescription>
            </RequestItem>
          ))}

          {serviceNotes.closedServiceNotes.map((request: ClosedNote) => (
            <RequestItem key={request.code}>
              <Type>{request.type}</Type>

              <TypeDescription>{request.typeDescription}</TypeDescription>

              <CodeGroup>{request.codeGroup}</CodeGroup>

              <CodeGroupDescription>
                {request.codeGroupDescription}
              </CodeGroupDescription>

              <Code>{request.code}</Code>

              <CodeDescription>{request.codeDescription}</CodeDescription>

              <OpeningDate>
                {format(request.openingDate, 'dd/MM/yyyy')}
              </OpeningDate>

              <ConclusionDate>
                {format(request.conclusionDate, 'dd/MM/yyyy')}
              </ConclusionDate>
            </RequestItem>
          ))}
        </RequestListContainer>
      </ModalContent>

      {isLoading && (
        <Loading isOpen={isLoading} message={message} setIsOpen={stop} />
      )}
    </Modal>
  );
};

export default RequestList;
