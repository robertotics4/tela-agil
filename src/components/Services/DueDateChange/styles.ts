import styled, { css } from 'styled-components';
import Select from 'react-select';

import Button from '../../Button';

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  min-height: 448px;
  overflow: hidden;

  padding: 0 48px;

  h2 {
    text-align: center;
    color: #3c1491;
  }

  h1 {
    margin-top: 24px;
    text-align: center;
  }
`;

export const SelectContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
`;

export const SelectDate = styled(Select)`
  width: 100%;
  height: 40px;

  margin-top: 24px;
`;

export const SelectedInfo = styled.span`
  margin-top: 16px;

  font-size: 16px;
  color: #444444;
  text-align: center;
`;

export const ConfirmButton = styled(Button)`
  background: transparent;
  color: #3c1491;
  border: 1px solid #3c1491;
  height: 40px;

  ${props =>
    props.disabled
      ? css`
          opacity: 25%;
          cursor: not-allowed;

          &:hover {
            background: transparent;
            color: #3c1491;
          }
        `
      : css`
          &:hover {
            background: #3c1491;
            color: #fff;
          }
        `}
`;
