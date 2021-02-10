import React from 'react';

import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import { CustomerServiceProvider } from './customerService';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <ToastProvider>
      <CustomerServiceProvider>{children}</CustomerServiceProvider>
    </ToastProvider>
  </AuthProvider>
);

export default AppProvider;
