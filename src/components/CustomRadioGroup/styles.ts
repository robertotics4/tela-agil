import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;

  > strong {
    font-size: 14px;
  }

  label {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    margin-top: 8px;

    input {
      height: 16px;
    }

    span {
      font-size: 16px;
      color: #fff;

      margin-left: 6px;
    }
  }
`;
