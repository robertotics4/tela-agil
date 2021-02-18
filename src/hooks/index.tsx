import React from 'react';

import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import { CustomerServiceProvider } from './customerService';
import { DebitsConsultationProvider } from './debitsConsultation';
import { WhatsappSendingProvider } from './useWhatsappSending';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <ToastProvider>
      <CustomerServiceProvider>
        <DebitsConsultationProvider>
          <WhatsappSendingProvider>{children}</WhatsappSendingProvider>
        </DebitsConsultationProvider>
      </CustomerServiceProvider>
    </ToastProvider>
  </AuthProvider>
);

export default AppProvider;
