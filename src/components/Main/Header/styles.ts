import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  min-height: 72px;
  width: 100%;
  padding: 0 24px;

  background: #fff;
  border-bottom: 1px solid #e7e5e5;
`;

export const ProtocolContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  min-width: 110px;
  margin-right: 16px;
`;

export const ProtocolText = styled.h2`
  font-size: 24px;
`;

export const LoadingProtocolContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const LoadingProtocolText = styled.span`
  font-size: 14px;
  color: #000;

  margin-right: 16px;
`;

export const ImportantInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ButtonChangeContract = styled.button`
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
`;
