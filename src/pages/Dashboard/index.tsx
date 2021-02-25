import React from 'react';

import { Container, WaitingForService } from './styles';

import { useCustomerService } from '../../hooks/customerService';

import LeftBar from '../../components/LeftBar';
import Main from '../../components/Main';

const Dashboard: React.FC = () => {
  const { customer, serviceStarted } = useCustomerService();

  return (
    <Container>
      <LeftBar />

      {serviceStarted && customer ? (
        <Main />
      ) : (
        <WaitingForService>
          <h2>Aguardando atendimento</h2>
        </WaitingForService>
      )}
    </Container>
  );
};

export default Dashboard;
