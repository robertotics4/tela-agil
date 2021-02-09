import React from 'react';

import { Container, RightContainer } from './styles';

import ClientData from './ClientData';
import ContractData from './ContractData';
import AlertsContainer from './AlertsContainer';
import QuickMenu from './QuickMenu';

const ServicesContent: React.FC = () => {
  return (
    <Container>
      <ClientData />
      <RightContainer>
        <ContractData />
        <AlertsContainer />
      </RightContainer>
      <QuickMenu />
    </Container>
  );
};

export default ServicesContent;
