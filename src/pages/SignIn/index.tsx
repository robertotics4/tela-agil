import React, { useCallback, useEffect, useRef } from 'react';
import { FiUser, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { useLoading } from 'react-use-loading';
import Swal from 'sweetalert2';

import Loading from '../../components/Loading';

import { useAuth } from '../../hooks/auth';

import getValidationErrors from '../../utils/getValidationErrors';

import { Container, Content, AnimationContainer } from './styles';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

interface SignInFormData {
  username: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const [{ isLoading, message }, { start, stop }] = useLoading();

  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        start('Verificando as credenciais do usuário...');

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          username: Yup.string().required('Usuário obrigatório'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          username: data.username,
          password: data.password,
        });

        history.push(`${process.env.PUBLIC_URL}/dashboard`);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        Swal.fire({
          icon: 'error',
          title: 'Erro na autenticação',
          html:
            '<p>Ocorreu um erro ao fazer o login, cheque as credenciais</p>',
          confirmButtonText: `OK`,
          confirmButtonColor: '#3c1490',
        });
      } finally {
        stop();
      }
    },
    [signIn, history, start, stop],
  );

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Equatorial" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <Input
              name="username"
              icon={FiUser}
              type="text"
              placeholder="Usuário"
              autoComplete="off"
            />

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
              autoComplete="off"
            />

            <Button type="submit">Entrar</Button>
          </Form>
        </AnimationContainer>
      </Content>

      {isLoading && (
        <Loading isOpen={isLoading} message={message} setIsOpen={stop} />
      )}
    </Container>
  );
};

export default SignIn;
