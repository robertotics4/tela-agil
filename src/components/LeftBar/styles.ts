import styled from 'styled-components';
import { shade } from 'polished';

import Button from '../Button';

export const Container = styled.aside`
  display: flex;
  flex-direction: column;

  width: 100%;
  max-width: 272px;
  background: #3c1491;
`;

export const UserMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  padding: 16px;

  border-bottom: 1px solid rgba(255, 255, 255, 0.5);

  > svg {
    width: 257px;
    height: 117px;
  }

  > span {
    width: 100%;
    font-size: 16px;
    color: #fff;

    margin-top: 32px;

    strong {
      margin-left: 6px;
    }
  }
`;

export const Logout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  width: 100%;
  margin-top: 16px;

  cursor: pointer;

  &:hover {
    > svg {
      color: #ffff00;
    }

    span {
      color: #ffff00;
    }
  }

  > svg {
    color: rgba(255, 255, 255, 0.5);
  }

  span {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.5);

    margin-left: 6px;
  }
`;

export const ServiceForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex: 1;

  width: 100%;
  padding: 16px;

  form {
    width: 100%;

    strong {
      font-size: 14px;
      color: #fff;
    }
  }
`;

export const WhiteButton = styled(Button)`
  padding: 0 16px;
  height: 40px;

  background: #fff;
  color: #3c1491;

  &:hover {
    /* background: ${shade(0.2, '#fff')}; */
    background: #ffff00;
  }
`;

export const Cronometro = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 24px;

  line-height: 29px;

  span {
    font-size: 16px;
    color: #fff;
  }

  h1 {
    color: #fff;
  }
`;
