import styled from 'styled-components';

export const Container = styled.div`
  height: calc(100vh - 72px);
  padding: 16px 24px;

  display: grid;
  grid-gap: 32px;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 2fr 1fr;
  grid-template-areas:
    'left right'
    'bottom bottom';
`;

export const Bottom = styled.div`
  grid-area: bottom;

  display: flex;
  justify-content: center;
  align-items: center;
`;
