import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  height: 88px;
  padding: 16px;

  background: #fff;
  border: 1px solid #e7e5e5;

  border-top: 4px solid #eb5757;

  span {
    font-size: 24px;
  }

  > div {
    display: flex;
    flex-direction: column;

    width: 255px;
    margin: 0 16px;

    h3 {
      font-size: 16px;
      color: #000;
    }

    p {
      font-size: 14px;
      color: #000;
    }
  }

  svg {
    margin-left: auto;
  }
`;
