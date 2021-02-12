import React, { useCallback, useRef } from 'react';
import { FiPower } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useLoading } from 'react-use-loading';

import getValidationErrors from '../../utils/getValidationErrors';

import {
  Container,
  UserMenu,
  Logout,
  ServiceForm,
  StartServiceButton,
  FinishServiceButton,
  Cronometro,
} from './styles';

import OutlineInput from '../OutlineInput';
import OutlineInputMask from '../OutlineInputMask';
import CustomRadioGroup from '../CustomRadioGroup';
import RadioOptions from '../CustomRadioGroup/RadioOptions';
import Loading from '../Loading';

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
  const [{ isLoading, message }, { start, stop }] = useLoading();

  const {
    startService,
    customer,
    finishService,
    serviceStarted,
  } = useCustomerService();

  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: StartServiceFormData) => {
      try {
        start('Localizando cliente ...');

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          contract: Yup.string().when('cpf', {
            is: (val: string) => !val.length,
            then: Yup.string().required('Conta contrato obrigatória'),
            otherwise: Yup.string(),
          }),
          cpf: Yup.string(),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await startService({
          stateCode: data.state[0],
          contract: data.contract,
          cpf: data.cpf.replaceAll('-', '').replaceAll('.', ''),
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
        }
      } finally {
        stop();
      }
    },
    [startService, start, stop],
  );

  const handleFinishService = useCallback(() => {
    finishService();
  }, [finishService]);

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

          <OutlineInputMask
            name="cpf"
            mask="999.999.999-99"
            type="text"
            placeholder="CPF ou CNPJ"
            autoComplete="off"
          />

          {serviceStarted && customer ? (
            <FinishServiceButton type="button" onClick={handleFinishService}>
              Encerrar atendimento
            </FinishServiceButton>
          ) : (
            <StartServiceButton type="submit">
              Iniciar atendimento
            </StartServiceButton>
          )}

          {serviceStarted && customer && (
            <Cronometro>
              <span>Tempo de atendimento:</span>
              <h1>00:01</h1>
            </Cronometro>
          )}
        </Form>
      </ServiceForm>

      {isLoading && (
        <Loading isOpen={isLoading} message={message} setIsOpen={stop} />
      )}
    </Container>
  );
};

export default LeftBar;
