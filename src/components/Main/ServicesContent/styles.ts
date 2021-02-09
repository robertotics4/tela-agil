import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-template-rows: repeat(3, auto);
  grid-gap: 24px;

  padding: 24px 32px;
`;

export const RightContainer = styled.div`
  grid-column: 2 / 2;
  grid-row: 1 / 3;

  display: flex;
  flex-direction: column;
`;
