import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  min-height: 72px;
  width: 100%;
  padding: 0 24px;

  background: #fff;
  border-bottom: 1px solid #e7e5e5;

  h2 {
    font-size: 24px;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 9px 12px;

    font-size: 16px;
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
