import React from 'react';

import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import { CustomerServiceProvider } from './customerService';
import { DebitsConsultationProvider } from './debitsConsultation';
import { WhatsappSendingProvider } from './whatsappSending';
import { PowerOutageServiceProvider } from './powerOutageService';
import { PowerReconnectionProvider } from './powerReconnectionService';
import { ChangeDueDateServiceProvider } from './changeDueDateService';
import { MonitoringOfProtocolsProvider } from './monitoringOfProtocols';
import { AlertProvider } from './alert';
import { TimerProvider } from './timer';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <TimerProvider>
      <AlertProvider>
        <ToastProvider>
          <CustomerServiceProvider>
            <DebitsConsultationProvider>
              <PowerOutageServiceProvider>
                <PowerReconnectionProvider>
                  <ChangeDueDateServiceProvider>
                    <MonitoringOfProtocolsProvider>
                      <WhatsappSendingProvider>
                        {children}
                      </WhatsappSendingProvider>
                    </MonitoringOfProtocolsProvider>
                  </ChangeDueDateServiceProvider>
                </PowerReconnectionProvider>
              </PowerOutageServiceProvider>
            </DebitsConsultationProvider>
          </CustomerServiceProvider>
        </ToastProvider>
      </AlertProvider>
    </TimerProvider>
  </AuthProvider>
);

export default AppProvider;
