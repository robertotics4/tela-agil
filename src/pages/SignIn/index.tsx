import React, { useCallback, useRef } from 'react';
import { FiUser, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/AuthContext';

import getValidationErrors from '../../utils/getValidationErrors';

import { Container, Content } from './styles';

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

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          username: Yup.string().required('Usuário obrigatório'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        signIn({
          username: data.username,
          password: data.password,
        });
      } catch (err) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
      }
    },
    [signIn],
  );

  return (
    <Container>
      <Content>
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
      </Content>
    </Container>
  );
};

export default SignIn;
