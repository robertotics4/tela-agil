import React from 'react';

import { Container } from './styles';

import Header from './Header';
import ServicesContent from './ServicesContent';

const Main: React.FC = () => {
  return (
    <Container>
      <Header />
      <ServicesContent />
    </Container>
  );
};

export default Main;
