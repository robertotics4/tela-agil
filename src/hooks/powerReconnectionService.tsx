import React, { createContext, useCallback, useContext } from 'react';

import eqtlBarApi from '../services/eqtlBarApi';

interface PowerReconnectionContextData {
  ableToReconnection(): void;
  suitableForEmergencyReconnection(): void;
}

const PowerReconnectionServiceContext = createContext<PowerReconnectionContextData>(
  {} as PowerReconnectionContextData,
);

const PowerReconnectionProvider: React.FC = ({ children }) => {
  const ableToReconnection = useCallback(() => {
    console.log();
  }, []);

  const suitableForEmergencyReconnection = useCallback(() => {
    console.log();
  }, []);

  return (
    <PowerReconnectionServiceContext.Provider
      value={{ ableToReconnection, suitableForEmergencyReconnection }}
    >
      {children}
    </PowerReconnectionServiceContext.Provider>
  );
};

function usePowerReconnectionService(): PowerReconnectionContextData {
  const context = useContext(PowerReconnectionServiceContext);

  if (!context) {
    throw new Error(
      'usePowerReconnectionService must be used within a PowerReconnectionProvider',
    );
  }

  return context;
}

export { PowerReconnectionProvider, usePowerReconnectionService };
