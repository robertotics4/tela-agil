import styled from 'styled-components';

export const Container = styled.div`
  display: block;

  position: fixed;
  bottom: 24px;

  width: 1124px;
  margin-top: 24px;

  h3 {
    font-size: 16px;
    color: #444444;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  padding: 16px 32px;
  margin-top: 8px;
  background: #fff;
  border: 1px solid #e7e5e5;

  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 75px;

    &:hover {
      button {
        background: #3c1491;
      }

      svg {
        color: #fff;
      }

      span {
        color: #3c1491;
        font-weight: bold;
      }
    }

    button {
      display: flex;
      align-items: center;
      justify-content: center;

      height: 50px;
      width: 50px;
      border-radius: 50%;
      border: 0;

      background: #bdbdbd;
      transition: background-color 0.2s;

      svg {
        color: #fff;
      }
    }

    span {
      height: 32px;

      font-size: 14px;
      color: #444444;
      text-align: center;

      margin-top: 8px;
    }
  }
`;
