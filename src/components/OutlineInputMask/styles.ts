import styled, { css } from 'styled-components';

import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isErrored: boolean;
  isDisabled?: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: #3c1490;
  border-radius: 8px;
  border: 1px solid #fff;

  padding: 0 16px;
  height: 40px;
  width: 100%;

  display: flex;
  align-items: center;

  & + div {
    margin-top: 8px;
  }

  ${props =>
    props.isErrored &&
    css`
      border-color: #ff5353;
      box-shadow: 0 0 4px #ff5353;
    `}

  ${props =>
    props.isFocused &&
    css`
      box-shadow: 0 0 4px #fff;
    `}

  ${props =>
    props.isDisabled &&
    css`
      opacity: 25%;
    `}



  input {
    flex: 1;
    border: 0;
    background: transparent;
    font-size: 14px;
    color: #fff;

    &::placeholder {
      color: #bfbfbf;
    }
  }

  svg {
    margin-right: 16px;
    color: #bfbfbf;

    ${props =>
      props.isFocused &&
      css`
        color: #3c1490;
      `}
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0;
  }

  span {
    background: #ff5353;
    color: #fff;
    text-align: center;

    &::before {
      border-color: #ff5353 transparent;
    }
  }
`;
