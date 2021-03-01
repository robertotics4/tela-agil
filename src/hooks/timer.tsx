import React, {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
} from 'react';
import { useStopwatch } from 'react-timer-hook';
import { format, parseISO } from 'date-fns';

interface TimerContextData {
  currentTime: string;
  startTimer(): void;
  stopTimer(): void;
  resetTimer(): void;
}

const TimerContext = createContext<TimerContextData>({} as TimerContextData);

const TimerProvider: React.FC = ({ children }) => {
  const [currentTime, setCurrentTime] = useState('-');

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

  useEffect(() => {
    setCurrentTime(format(new Date(0, 0, 0, hours, minutes, seconds), 'mm:ss'));
  }, [seconds, minutes, hours]);

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
      value={{ currentTime, startTimer, stopTimer, resetTimer }}
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
