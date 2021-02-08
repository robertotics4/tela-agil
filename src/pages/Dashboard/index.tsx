import React from 'react';

import { Container } from './styles';

import LeftBar from '../../components/LeftBar';
import Main from '../../components/Main';

const Dashboard: React.FC = () => {
  return (
    <Container>
      <LeftBar />
      <Main />
    </Container>
  );
};

export default Dashboard;
