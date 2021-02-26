import React from 'react';

import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import { CustomerServiceProvider } from './customerService';
import { DebitsConsultationProvider } from './debitsConsultation';
import { WhatsappSendingProvider } from './whatsappSending';
import { PowerOutageServiceProvider } from './powerOutageService';
import { AlertProvider } from './alert';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <AlertProvider>
      <ToastProvider>
        <CustomerServiceProvider>
          <DebitsConsultationProvider>
            <PowerOutageServiceProvider>
              <WhatsappSendingProvider>{children}</WhatsappSendingProvider>
            </PowerOutageServiceProvider>
          </DebitsConsultationProvider>
        </CustomerServiceProvider>
      </ToastProvider>
    </AlertProvider>
  </AuthProvider>
);

export default AppProvider;
