import React from 'react';

import { Container, Main } from './styles';

import LeftBar from '../../components/LeftBar';

const Dashboard: React.FC = () => {
  return (
    <Container>
      <LeftBar />
      <Main />
    </Container>
  );
};

export default Dashboard;
