import React from 'react';

import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import { LoadingProvider } from './loading';
import { CustomerServiceProvider } from './customerService';

const AppProvider: React.FC = ({ children }) => (
  <LoadingProvider>
    <AuthProvider>
      <ToastProvider>
        <CustomerServiceProvider>{children}</CustomerServiceProvider>
      </ToastProvider>
    </AuthProvider>
  </LoadingProvider>
);

export default AppProvider;
