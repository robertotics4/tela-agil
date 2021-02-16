import styled from 'styled-components';

import Button from '../Button';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 24px 96px;

  h2 {
    text-align: center;
    color: #3c1491;
  }

  h1 {
    text-align: center;
    margin-top: 16px;
  }

  > div {
    margin-top: 16px;
  }
`;

export const OutlineButton = styled(Button)`
  background: transparent;
  color: #3c1491;
  border: 1px solid #3c1491;

  &:hover {
    background: #3c1491;
    color: #fff;
  }
`;
