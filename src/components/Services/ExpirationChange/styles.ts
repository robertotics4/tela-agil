import styled from 'styled-components';

import Button from '../../Button';

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 0px 48px;

  h2 {
    text-align: center;
    color: #3c1491;
  }

  p {
    font-size: 32px;
    text-align: center;

    margin-top: 16px;
  }
`;

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 16px;

  width: 100%;
`;

export const OptionButton = styled(Button)`
  background: transparent;
  color: #3c1491;
  border: 1px solid #3c1491;

  &:hover {
    background: #3c1491;
    color: #fff;
  }

  & + button {
    margin-left: 16px;
  }
`;
