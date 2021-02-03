import React, { createContext, useCallback, useContext, useState } from 'react';

import api from '../services/api';

interface AuthState {
  user: object;
}

interface SignInCredentials {
  username: string;
  password: string;
}

interface AuthContextData {
  user: object;
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
    // const response = await api.post('/autenticacao/autenticar', {
    //   Usuario: username,
    //   Senha: password,
    //   EmpresaId: 101,
    //   Navegador: '',
    //   Dispositivo: '',
    //   Ip: '',
    //   Informacoes: null,
    // });

    const response = await api.get('/autenticacao');

    const { IdUsuario, NomeUsuario } = response.data;

    const user = {
      id: IdUsuario.toString(),
      username: NomeUsuario,
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
