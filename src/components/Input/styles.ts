import styled from 'styled-components';

export const Container = styled.div`
  background: #e5e5e5;
  border-radius: 8px;
  border: 2px solid #bfbfbf;
  padding: 16px;
  width: 100%;

  display: flex;
  align-items: center;

  & + div {
    margin-top: 8px;
  }

  &:focus-within {
    outline: none !important;
    border-radius: 8px;
    border: 2px solid #3c1490;
  }

  input {
    flex: 1;
    border: 0;
    background: transparent;

    &::placeholder {
      color: #bfbfbf;
    }
  }

  svg {
    margin-right: 16px;
    color: #bfbfbf;
  }
`;
