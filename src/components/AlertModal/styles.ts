import styled from 'styled-components';
import { shade } from 'polished';

export const AlertContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const AlertTitle = styled.h1`
  font-size: 36px;
  margin-top: 24px;
  text-align: center;
`;

export const AlertDescription = styled.p`
  font-size: 18px;
  color: #444444;
  text-align: center;
  margin-top: 16px;
`;

export const ConfirmationButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 10px;
  background: #3c1491;
  border: none;

  margin-top: 24px;
  padding: 12px 24px;

  &:hover {
    background: ${shade(0.2, '#3c1490')};
  }
`;

export const ConfirmationButtonText = styled.span`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;
