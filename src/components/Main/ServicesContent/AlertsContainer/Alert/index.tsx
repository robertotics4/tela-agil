import React from 'react';
import { FiArrowRightCircle } from 'react-icons/fi';

import { Container } from './styles';

const Alert: React.FC = () => {
  return (
    <Container>
      <span>💰</span>

      <div>
        <h3>Cliente com débitos</h3>
        <p>
          Ofereça ao cliente a possibilidade de pagar suas faturas pendentes.
        </p>
      </div>

      <FiArrowRightCircle size={32} />
    </Container>
  );
};

export default Alert;
