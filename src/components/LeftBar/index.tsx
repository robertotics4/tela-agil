import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FiPower } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { format } from 'date-fns';
import * as Yup from 'yup';
import { useLoading } from 'react-use-loading';
import { useStopwatch } from 'react-timer-hook';

import getValidationErrors from '../../utils/getValidationErrors';

import {
  Container,
  Logo,
  WelcomeText,
  Username,
  UserMenu,
  LogoutButton,
  LogoutButtonText,
  ServiceForm,
  StartServiceButton,
  FinishServiceButton,
  Cronometro,
} from './styles';

import OutlineInput from '../OutlineInput';
import OutlineInputRegex from '../OutlineInputRegex';
import OutlineInputMask from '../OutlineInputMask';
import CustomRadioGroup from '../CustomRadioGroup';
import RadioOptions from '../CustomRadioGroup/RadioOptions';
import Loading from '../Loading';
import FindContractModal from '../FindContractModal';

import logoWhiteImg from '../../assets/logo-white.svg';

import { useAuth } from '../../hooks/auth';
import { useCustomerService } from '../../hooks/customerService';
import { useToast } from '../../hooks/toast';
import { useAlert } from '../../hooks/alert';

interface StartServiceFormData {
  state: string;
  contract: string;
  cpf: string;
}

const LeftBar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { addToast } = useToast();
  const { customAlert } = useAlert();
  const [{ isLoading, message }, { start, stop }] = useLoading();

  const {
    start: startTimer,
    reset: resetTimer,
    isRunning,
    hours,
    seconds,
    minutes,
  } = useStopwatch({
    autoStart: false,
  });

  const {
    startService,
    customer,
    finishService,
    serviceStarted,
    findAllContracts,
    contracts,
  } = useCustomerService();

  const [openModalFindContract, setOpenModalFindContract] = useState(false);

  const formRef = useRef<FormHandles>(null);

  const toggleModalFindContract = useCallback(() => {
    setOpenModalFindContract(!openModalFindContract);
  }, [openModalFindContract]);

  const handleSubmit = useCallback(
    async (data: StartServiceFormData) => {
      try {
        start('Localizando cliente ...');

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          contract: Yup.string().when('cpf', {
            is: (val: string) => !val.length,
            then: Yup.string().required('Conta contrato obrigat??ria'),
            otherwise: Yup.string(),
          }),
          cpf: Yup.string(),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (data.contract && data.cpf) {
          customAlert({
            type: 'error',
            title: 'Erro no formul??rio',
            description:
              'Utilize apenas um dos campos (Conta contrato ou CPF / CNPJ)',
            confirmationText: 'OK',
          });

          return;
        }

        if (!data.contract && data.cpf) {
          const unformattedCpf = data.cpf.replace(/\D/gim, '');

          const responseContracts = await findAllContracts({
            stateCode: data.state[0],
            cpf: unformattedCpf,
          });

          if (responseContracts.length > 1) {
            toggleModalFindContract();
            return;
          }

          await startService({
            stateCode: data.state[0],
            contractAccount: responseContracts[0].contractAccount,
          });

          return;
        }

        const unformattedContract = data.contract.replace(/\D/gim, '');

        await startService({
          stateCode: data.state[0],
          contractAccount: unformattedContract,
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        customAlert({
          type: 'error',
          title: 'Erro no atendimento',
          description:
            'N??o foi poss??vel localizar o cliente, cheque as informa????es',
          confirmationText: 'OK',
        });
      } finally {
        stop();
      }
    },
    [
      startService,
      start,
      stop,
      customAlert,
      findAllContracts,
      toggleModalFindContract,
    ],
  );

  const formattedTime = useMemo(() => {
    return format(new Date(0, 0, 0, hours, minutes, seconds), 'mm:ss');
  }, [hours, minutes, seconds]);

  const handleFinishService = useCallback(async () => {
    try {
      start('Finalizando atendimento ...');

      await finishService(formattedTime);
    } catch {
      addToast({
        type: 'error',
        title: 'Registro de logs',
        description: 'Ocorreu um erro ao salvar o log do atendimento.',
      });
    } finally {
      stop();
    }
  }, [finishService, formattedTime, addToast, start, stop]);

  useEffect(() => {
    if (serviceStarted && !isRunning) {
      startTimer();
    }

    if (!serviceStarted) {
      resetTimer();
    }
  }, [serviceStarted, startTimer, isRunning, resetTimer]);

  return (
    <Container>
      <UserMenu>
        <Logo src={logoWhiteImg} alt="Equatorial Energia" />

        <WelcomeText>
          Bem vindo,
          <Username>{user.name}</Username>
        </WelcomeText>

        <LogoutButton onClick={signOut}>
          <FiPower />
          <LogoutButtonText>Sair</LogoutButtonText>
        </LogoutButton>
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
                { id: 'radio2', value: '98', label: 'Maranh??o' },
                { id: 'radio3', value: '95', label: 'Par??' },
                { id: 'radio4', value: '86', label: 'Piau??' },
              ]}
              disabled={serviceStarted}
            />
          </CustomRadioGroup>

          <OutlineInputRegex
            name="contract"
            type="text"
            mask="contractAccount"
            placeholder="C??digo ??nico ou conta contrato"
            autoComplete="off"
            disabled={serviceStarted}
          />

          <OutlineInputRegex
            name="cpf"
            type="text"
            mask="cpfCnpj"
            placeholder="CPF ou CNPJ"
            autoComplete="off"
            disabled={serviceStarted}
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
              <h1>{formattedTime}</h1>
            </Cronometro>
          )}
        </Form>
      </ServiceForm>

      {contracts && (
        <FindContractModal
          isOpen={openModalFindContract}
          setIsOpen={toggleModalFindContract}
        />
      )}

      {isLoading && (
        <Loading isOpen={isLoading} message={message} setIsOpen={stop} />
      )}
    </Container>
  );
};

export default LeftBar;
