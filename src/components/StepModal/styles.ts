import styled from 'styled-components';

import Button from '../Button';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 24px 48px;
`;

export const ModalTitle = styled.h2`
  font-size: 24px;
  text-align: center;
  color: #3c1491;
`;

export const QuestionTitle = styled.p`
  font-size: 32px;
  text-align: center;
  margin-top: 16px;
`;

export const QuestionContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  width: 100%;
  margin-top: 16px;
`;

export const OutlineButton = styled(Button)`
  background: transparent;
  color: #3c1491;
  border: 1px solid #3c1491;

  width: auto;

  & + button {
    margin-left: 16px;
  }

  &:hover {
    background: #3c1491;
    color: #fff;
  }
`;
