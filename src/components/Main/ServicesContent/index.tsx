import React from 'react';

import { Container, Bottom } from './styles';

import ClientData from './ClientData';
import ContractData from './ContractData';
import QuickMenu from './QuickMenu';

const ServicesContent: React.FC = () => {
  return (
    <Container>
      <ClientData />
      <ContractData />
      {/* <Bottom>
        <QuickMenu />
      </Bottom> */}
    </Container>
  );
};

export default ServicesContent;
