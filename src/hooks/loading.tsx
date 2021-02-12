import React, { createContext, useCallback, useContext, useState } from 'react';

import LoadingContainer from '../components/LoadingContainer';

interface LoadingContextData {
  isLoading: boolean;
  toggleLoading(): void;
}

const LoadingContext = createContext<LoadingContextData>(
  {} as LoadingContextData,
);

const LoadingProvider: React.FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const toggleLoading = useCallback(() => {
    setIsLoading(!isLoading);
  }, [setIsLoading, isLoading]);

  return (
    <LoadingContext.Provider value={{ isLoading, toggleLoading }}>
      {children}
      <LoadingContainer />
    </LoadingContext.Provider>
  );
};

function useLoading(): LoadingContextData {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error('useLoading must be used within an LoadingProvider');
  }

  return context;
}

export { LoadingProvider, useLoading };
