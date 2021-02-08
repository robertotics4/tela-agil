import React from 'react';
import { BiTransfer } from 'react-icons/bi';

import { Container, ImportantInfo } from './styles';

import TagInfo from './TagInfo';

const Header: React.FC = () => {
  return (
    <Container>
      <h2>Protocolo: 92837627872</h2>

      <ImportantInfo>
        <TagInfo type="error" message="Desliga em andamento" />
        <TagInfo type="error" message="Com débitos" />
        <TagInfo type="success" message="Sem desligamento programado" />
      </ImportantInfo>

      <button type="button">
        <BiTransfer />
        Trocar unidade
      </button>
    </Container>
  );
};

export default Header;
