import styled from 'styled-components';

export const Container = styled.aside`
  display: flex;
  flex-direction: column;

  width: 100%;
  max-width: 272px;
  background: #3c1491;
`;

export const UserMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  padding: 16px;

  border-bottom: 1px solid rgba(255, 255, 255, 0.5);

  > svg {
    width: 257px;
    height: 117px;
  }

  > span {
    font-size: 16px;
    color: #fff;

    margin-top: 32px;

    strong {
      margin-left: 6px;
    }
  }
`;

export const Logout = styled.div`
  display: flex;
  flex-direction: row;

  width: 100%;
  margin-top: 16px;

  > svg {
    color: rgba(255, 255, 255, 0.5);
  }

  span {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.5);

    margin-left: 6px;
  }
`;

export const ServiceForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  padding: 16px;

  form {
    width: 100%;
    text-align: left;

    div {
      strong {
        display: block;
        font-size: 14px;
        color: #fff;

        margin-bottom: 16px;
      }

      label {
        display: block;

        input {
          
        }

        span {
          font-size: 16px;
          color: #fff;

          margin-left: 6px;
        }
      }
    }
  }
`;

export const Cronometro = styled.div``;
