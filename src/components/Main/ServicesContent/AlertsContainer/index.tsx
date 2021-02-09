import React from 'react';

import { Container, Content } from './styles';

import Alert from './Alert';

const AlertsContainer: React.FC = () => {
  return (
    <Container>
      <h3>Alertas</h3>

      <Content>
        <Alert />
        <Alert />
      </Content>
    </Container>
  );
};

export default AlertsContainer;
