import React from 'react';

import { Container } from './styles';

import LoadingModal from './LoadingModal';

import { useLoading } from '../../hooks/loading';

const LoadingContainer: React.FC = () => {
  const { isLoading, toggleLoading } = useLoading();

  return (
    <Container>
      <LoadingModal isOpen={isLoading} setIsOpen={toggleLoading} />
    </Container>
  );
};

export default LoadingContainer;
