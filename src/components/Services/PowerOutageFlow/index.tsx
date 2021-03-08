import React, { useCallback, useEffect, useState } from 'react';

import StepModal, { Question } from './StepModal';

import { useCustomerService } from '../../../hooks/customerService';

import powerOutageQuestions from './questions/PowerOutageQuestions';

interface FlowComponentProps {
  modalOpen: boolean;
  toggleModal(): void;
}

const PowerOutageFlow: React.FC<FlowComponentProps> = ({
  modalOpen,
  toggleModal,
}) => {
  const [questions, setQuestions] = useState<Question[]>(powerOutageQuestions);
  const [currentQuestion, setCurrentQuestion] = useState(questions[0]);

  const handleSetCurrentQuestion = useCallback(
    (nextQuestionId: string) => {
      const nextQuestion: Question | undefined = questions.find(
        question => question.id === nextQuestionId,
      );

      if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
      }
    },
    [questions],
  );

  const handleClearFlow = useCallback(() => {
    setCurrentQuestion(questions[0]);
  }, [questions]);

  return (
    <StepModal
      isOpen={modalOpen}
      setIsOpen={toggleModal}
      title="Falta de energia"
      question={currentQuestion}
      setCurrentQuestion={handleSetCurrentQuestion}
      clearFlow={handleClearFlow}
    />
  );
};

export default PowerOutageFlow;
