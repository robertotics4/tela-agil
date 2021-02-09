import React, { createContext, useCallback, useContext, useState } from 'react';

import api from '../services/api';

interface User {
  id: string;
  name: string;
}

interface AuthState {
  user: User;
}

interface SignInCredentials {
  username: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const user = localStorage.getItem('@TelaAgil:user');

    if (user) {
      return { user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ username, password }) => {
    api.defaults.headers.Autorizacao =
      'yuS3txGkbzhzVvCOS1BbI3U4zRVC+ov58+TUdr7ocNuVwvVyP+95gNwMX+pwx/uR';

    const response = await api.post(
      '/integracaoca/api/autenticacao/autenticar/',
      {
        Usuario: username,
        Senha: password,
        EmpresaId: 101,
        Navegador: '',
        Dispositivo: '',
        Ip: '',
        Informacoes: null,
      },
    );

    const { IdUsuario, NomeUsuario } = response.data;

    const user = {
      id: IdUsuario.toString(),
      name: NomeUsuario,
    };

    localStorage.setItem('@TelaAgil:user', JSON.stringify(user));

    setData({ user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@TelaAgil:user');

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
