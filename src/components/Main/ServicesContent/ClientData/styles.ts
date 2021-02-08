import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 511px;

  h3 {
    font-size: 16px;
    color: #444444;
  }
`;
export const Content = styled.div`
  background: #fff;
  border: 1px solid #e7e5e5;

  padding: 16px;
  margin-top: 8px;

  div {
    display: flex;
    flex-direction: row;
  }

  label {
    font-size: 12px;
    font-weight: bold;
    color: #000;

    p {
      font-size: 14px;
      color: #4f4f4f;
      font-weight: 400;
    }
  }
`;
