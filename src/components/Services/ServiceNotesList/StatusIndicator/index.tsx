import React from 'react';

import { Container, StatusTitle } from './styles';

interface StatusProps {
  type: 'open' | 'concluded' | 'canceled';
  title: string;
}

const StatusIndicator: React.FC<StatusProps> = ({ type, title }) => (
  <Container type={type}>
    <StatusTitle>{title}</StatusTitle>
  </Container>
);

export default StatusIndicator;
