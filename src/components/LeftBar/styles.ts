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
export const Logo = styled.img`
  width: 257px;
  height: 117px;
`;

export const WelcomeText = styled.span`
  width: 100%;
  font-size: 16px;
  color: #fff;

  margin-top: 32px;
`;

export const Username = styled.strong`
  margin-left: 6px;
`;

export const UserMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  padding: 16px;

  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
`;

export const LogoutButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  width: 100%;
  margin-top: 16px;

  cursor: pointer;

  &:hover {
    > svg {
      color: #fff;
      text-shadow: 0 0 4px #fff;
    }

    span {
      color: #fff;
      text-shadow: 0 0 4px #fff;
    }
  }

  > svg {
    color: rgba(255, 255, 255, 0.5);
    transition: color 0.2s;
  }
`;

export const LogoutButtonText = styled.span`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.2s;

  margin-left: 6px;
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

export const StartServiceButton = styled(Button)`
  padding: 0 16px;
  height: 40px;

  background: #fff;
  color: #3c1491;

  &:hover {
    background: ${shade(0.2, '#fff')};
  }
`;

export const FinishServiceButton = styled(Button)`
  padding: 0 16px;
  height: 40px;

  background: #ff5353;
  color: #fff;

  &:hover {
    background: ${shade(0.2, '#FF5353')};
  }
`;

export const Cronometro = styled.div`
  display: flex;
  flex-direction: column;
  bottom: 24px;

  position: fixed;
  z-index: 10;

  line-height: 29px;

  span {
    margin-top: auto;
    font-size: 16px;
    color: #fff;
  }

  h1 {
    color: #fff;
  }
`;
