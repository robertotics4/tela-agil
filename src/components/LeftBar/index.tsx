import React, { useCallback, useRef } from 'react';
import { FiPower } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import axios from 'axios';
import {
  Container,
  UserMenu,
  Logout,
  ServiceForm,
  WhiteButton,
  Cronometro,
} from './styles';

import OutlineInput from '../OutlineInput';
import CustomRadioGroup from '../CustomRadioGroup';

import logoWhiteImg from '../../assets/logo-white.svg';
import { useAuth } from '../../hooks/auth';

interface StartServiceFormData {
  stateCode: string;
  contract: string;
  cpf: string;
}

const LeftBar: React.FC = () => {
  const { signOut } = useAuth();
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(async (data: StartServiceFormData) => {
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

        <Logout onClick={signOut}>
          <FiPower />
          <span>Sair</span>
        </Logout>
      </UserMenu>

      <ServiceForm>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <CustomRadioGroup
            name="stateCode"
            fieldLabel="Estado"
            states={[
              { name: 'Alagoas', code: '82' },
              { name: 'Maranhão', code: '98' },
              { name: 'Pará', code: '95' },
              { name: 'Piauí', code: '86' },
            ]}
          />

          <OutlineInput
            name="contract"
            type="text"
            placeholder="Código único ou conta contrato"
            autoComplete="off"
          />

          <OutlineInput
            name="cpf"
            type="text"
            placeholder="CPF ou CNPJ"
            autoComplete="off"
          />

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
