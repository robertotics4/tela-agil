import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  max-height: 72px;
  width: 100%;
  padding: 24px;

  background: #fff;

  button {
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 9px 12px;

    background: #fff;
    color: #3c1491;
    border-radius: 8px;
    border: 1px solid #3c1491;
    transition: background-color 0.2s;

    &:hover {
      background: #3c1491;
      color: #fff;

      svg {
        color: #fff;
      }
    }

    svg {
      color: #3c1491;
      transform: rotate(90deg);
      margin-right: 8px;
    }
  }
`;

export const ImportantInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
