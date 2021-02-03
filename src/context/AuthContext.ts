import { createContext } from 'react';

interface AuthContext {
  name: string;
}

const authContext = createContext<AuthContext>({} as AuthContext);

export default authContext;
