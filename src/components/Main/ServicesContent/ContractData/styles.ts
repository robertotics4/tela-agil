import styled from 'styled-components';

export const Container = styled.div`
  grid-area: right;

  display: flex;
  flex-direction: column;
  flex: 1;

  h3 {
    font-size: 16px;
    color: #444444;
  }
`;

export const Content = styled.div`
  background: #fff;
  border: 1px solid #e7e5e5;
  height: 100%;

  padding: 24px 32px;
  margin-top: 8px;

  div {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 14px;

    label {
      display: block;

      font-size: 12px;
      font-weight: bold;
      line-height: 16px;
      color: #000;

      p {
        font-size: 14px;
        font-weight: 400;
        line-height: 16px;
        color: #4f4f4f;
      }
    }
  }
`;
