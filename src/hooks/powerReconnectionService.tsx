import React, { createContext, useCallback, useContext } from 'react';

import eqtlBarApi from '../services/eqtlBarApi';

interface PowerReconnectionContextData {
  ableToReconnection(): boolean;
  suitableForEmergencyReconnection(): boolean;
}

const PowerReconnectionServiceContext = createContext<PowerReconnectionContextData>(
  {} as PowerReconnectionContextData,
);

const PowerReconnectionProvider: React.FC = ({ children }) => {
  const ableToReconnection = useCallback(() => {
    return false; // HARD CODDED
  }, []);

  const suitableForEmergencyReconnection = useCallback(() => {
    return false; // HARD CODDED
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
