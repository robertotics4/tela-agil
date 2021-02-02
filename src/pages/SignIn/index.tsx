import React from 'react';
import { FiUser, FiLock } from 'react-icons/fi';

import { Container, Content } from './styles';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

const SignIn: React.FC = () => (
  <Container>
    <Content>
      <img src={logoImg} alt="Equatorial" />

      <form>
        <Input
          name="user"
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
      </form>
    </Content>
  </Container>
);

export default SignIn;
