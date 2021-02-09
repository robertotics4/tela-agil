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

  padding: 24px;
  margin-top: 8px;

  div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 14px;

    label {
      display: block;
      margin: 0 8px;

      font-size: 12px;
      font-weight: bold;
      color: #000;

      p {
        font-size: 14px;
        color: #4f4f4f;
        font-weight: 400;
      }

      &:last-child {
        background: yellow;
      }
    }
  }
`;
