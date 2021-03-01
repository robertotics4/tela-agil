import styled from 'styled-components';

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 0px 24px;
`;

export const Title = styled.h2`
  text-align: center;
  color: #3c1491;
`;

export const RequestListContainer = styled.ul`
  list-style-type: none;
  width: 100%;
  max-height: 360px;
  overflow: auto;

  margin-top: 24px;
`;

export const RequestItem = styled.li`
  span + span {
    margin-left: 8px;
  }
`;

export const Type = styled.span``;

export const TypeDescription = styled.span``;

export const CodeGroup = styled.span``;

export const CodeGroupDescription = styled.span``;

export const Code = styled.span``;

export const CodeDescription = styled.span``;

export const OpeningDate = styled.span``;

export const ConclusionDate = styled.span``;

export const Status = styled.span``;

export const RejectionCode = styled.span``;

export const RejectionCodeDescription = styled.span``;
