import React from 'react';

import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import { CustomerServiceProvider } from './customerService';
import { DebitsConsultationProvider } from './debitsConsultation';
import { WhatsappSendingProvider } from './useWhatsappSending';
import { PowerOutageServiceProvider } from './powerOutageService';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <ToastProvider>
      <CustomerServiceProvider>
        <DebitsConsultationProvider>
          <PowerOutageServiceProvider>
            <WhatsappSendingProvider>{children}</WhatsappSendingProvider>
          </PowerOutageServiceProvider>
        </DebitsConsultationProvider>
      </CustomerServiceProvider>
    </ToastProvider>
  </AuthProvider>
);

export default AppProvider;
