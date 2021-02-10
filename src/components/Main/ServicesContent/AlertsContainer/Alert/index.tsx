import React from 'react';
import { IoChevronForwardCircleOutline } from 'react-icons/io5';

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

      <IoChevronForwardCircleOutline size={32} />
    </Container>
  );
};

export default Alert;
