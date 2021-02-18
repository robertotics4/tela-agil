import React from 'react';

import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import { CustomerServiceProvider } from './customerService';
import { DebitsConsultationProvider } from './debitsConsultation';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <ToastProvider>
      <CustomerServiceProvider>
        <DebitsConsultationProvider>{children}</DebitsConsultationProvider>
      </CustomerServiceProvider>
    </ToastProvider>
  </AuthProvider>
);

export default AppProvider;
