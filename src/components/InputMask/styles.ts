import styled, { css } from 'styled-components';

import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: #fff;
  border-radius: 8px;
  border: 2px solid #e7e5e5;
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
    `}

  ${props =>
    props.isFocused &&
    css`
      color: #3c1490;
      border-color: #3c1490;
    `}

   input {
    flex: 1;
    border: 0;
    background: transparent;
    color: #444444;

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
    text-align: center;

    background: #ff5353;
    color: #fff;

    &::before {
      border-color: #ff5353 transparent;
    }
  }
`;
