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
import CustomRadioGroup from '../CustomRadioGroup';
import RadioOptions from '../CustomRadioGroup/RadioOptions';

import logoWhiteImg from '../../assets/logo-white.svg';
import { useAuth } from '../../hooks/auth';
import { useCustomerService } from '../../hooks/customerService';

interface StartServiceFormData {
  state: string;
  contract: string;
  cpf: string;
}

const LeftBar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { getCustomer } = useCustomerService();
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: StartServiceFormData) => {
      try {
        await getCustomer({
          stateCode: data.state[0],
          contract: data.contract,
          cpf: data.cpf,
        });
      } catch (err) {
        console.log(err);
      }
    },
    [getCustomer],
  );

  return (
    <Container>
      <UserMenu>
        <img src={logoWhiteImg} alt="Equatorial Energia" />

        <span>
          Bem vindo,
          <strong>{user.name}</strong>
        </span>

        <Logout onClick={signOut}>
          <FiPower />
          <span>Sair</span>
        </Logout>
      </UserMenu>

      <ServiceForm>
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          initialData={{ state: '82' }}
        >
          <CustomRadioGroup fieldLabel="Estado">
            <RadioOptions
              name="state"
              options={[
                { id: 'radio1', value: '82', label: 'Alagoas' },
                { id: 'radio2', value: '98', label: 'Maranhão' },
                { id: 'radio3', value: '95', label: 'Pará' },
                { id: 'radio4', value: '86', label: 'Piauí' },
              ]}
            />
          </CustomRadioGroup>

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
