import React, { createContext, useContext, useCallback } from 'react';
import { useStopwatch } from 'react-timer-hook';

interface TimerContextData {
  startTimer(): void;
  stopTimer(): void;
  resetTimer(): void;
  hours: number;
  minutes: number;
  seconds: number;
  isRunning: boolean;
}

const TimerContext = createContext<TimerContextData>({} as TimerContextData);

const TimerProvider: React.FC = ({ children }) => {
  const {
    hours,
    seconds,
    minutes,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({
    autoStart: false,
  });

  const startTimer = useCallback(() => {
    start();
  }, [start]);

  const stopTimer = useCallback(() => {
    pause();
  }, [pause]);

  const resetTimer = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <TimerContext.Provider
      value={{
        startTimer,
        stopTimer,
        resetTimer,
        hours,
        minutes,
        seconds,
        isRunning,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

function useTimer(): TimerContextData {
  const context = useContext(TimerContext);

  if (!context) {
    throw new Error('useTimer must be used within an TimerProvider');
  }

  return context;
}

export { TimerProvider, useTimer };
