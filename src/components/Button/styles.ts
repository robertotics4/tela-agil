import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  background: #3c1490;
  border-radius: 8px;
  border: 0;
  padding: 0 16px;
  height: 56px;
  width: 100%;
  color: #fff;
  font-weight: 500;
  margin-top: 16px;
  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#3c1490')};
  }
`;
