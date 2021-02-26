import styled from 'styled-components';

export const Container = styled.div`
  label {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 8px;

    input {
      height: 16px;
      cursor: pointer;
    }

    span {
      font-size: 16px;
      color: #fff;
      cursor: pointer;

      margin-left: 6px;
    }
  }
`;
