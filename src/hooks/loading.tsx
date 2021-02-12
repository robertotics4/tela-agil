import React, { createContext, useCallback, useContext, useState } from 'react';

interface LoadingContextData {
  toggleLoad(): void;
}

const LoadingContext = createContext<LoadingContextData>({} as LoadingContextData);

const LoadingProvider: React.FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState<>(false);


function useLoading(): LoadingContextData {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error('useLoading must be used within an ToastProvider');
  }

  return context;
}

export { LoadingProvider, useToast };
