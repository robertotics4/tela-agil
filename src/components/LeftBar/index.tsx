import React from 'react';
import { FiPower } from 'react-icons/fi';

import { Container, UserMenu, Logout, ServiceForm, Cronometro } from './styles';

import Input from '../Input';
import Button from '../Button';

import logoWhiteImg from '../../assets/logo-white.svg';

const LeftBar: React.FC = () => (
  <Container>
    <UserMenu>
      <img src={logoWhiteImg} alt="Equatorial Energia" />

      <span>
        Bem vindo,
        <strong>ROBERTO OLIVEIRA</strong>
      </span>

      <Logout>
        <FiPower />
        <span>Sair</span>
      </Logout>
    </UserMenu>

    <ServiceForm>
      <form>
        {/* <strong>Código único ou conta contrato</strong>
        <Input name="contract" type="text" /> */}
        {/*
        <strong>CPF ou CNPJ</strong>
        <Input name="cpf" type="text" /> */}

        <Button type="button">Iniciar atendimento</Button>

        <Cronometro>
          <span>Tempo de atendimento:</span>
          <span>-</span>
        </Cronometro>
      </form>
    </ServiceForm>
  </Container>
);

export default LeftBar;
