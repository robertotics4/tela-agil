import React, { useCallback, useRef } from 'react';
import { FiPower } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import {
  Container,
  UserMenu,
  Logout,
  ServiceForm,
  WhiteButton,
  Cronometro,
} from './styles';

import OutlineInput from '../OutlineInput';

import logoWhiteImg from '../../assets/logo-white.svg';

const LeftBar: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(data => {
    console.log(data);
  }, []);

  return (
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
        <Form ref={formRef} onSubmit={handleSubmit}>
          <OutlineInput
            name="contract"
            type="text"
            placeholder="Código único ou conta contrato"
          />

          <OutlineInput name="cpf" type="text" placeholder="CPF ou CNPJ" />

          <WhiteButton type="submit">Iniciar atendimento</WhiteButton>

          <Cronometro>
            <span>Tempo de atendimento:</span>
            <h1>00:01</h1>
          </Cronometro>
        </Form>
      </ServiceForm>
    </Container>
  );
};

export default LeftBar;
