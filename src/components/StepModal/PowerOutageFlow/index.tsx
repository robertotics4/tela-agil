import React, { useCallback, useState } from 'react';

import StepModal, { Question } from '..';

interface FlowComponentProps {
  modalOpen: boolean;
  toggleModal(): void;
}

interface Answer {
  questionId: string;
  content: string;
}

const powerOutageQuestions: Question[] = [
  {
    id: 'f1-q1',
    title:
      'Você está totalmente sem energia ou sua luz está oscilando (ou fraca) ?',
    options: [
      {
        answer: 'Sem energia',
        nextQuestionId: 'f1-q2',
      },
      {
        answer: 'Oscilando ou fraca',
      },
    ],
  },
  {
    id: 'f1-q2',
    title: 'Faltou luz em todo o seu imóvel ou apenas em algumas partes dele?',
    options: [
      {
        answer: 'Todo o imóvel',
        nextQuestionId: 'f1-q3',
      },
      {
        answer: 'Algumas partes',
      },
    ],
  },
  {
    id: 'f1-q3',
    title: 'Faltou energia na rua toda ou só na sua casa?',
    options: [
      {
        answer: 'Rua toda',
      },
      {
        answer: 'Minha casa',
        nextQuestionId: 'f1-q4',
      },
    ],
  },
  {
    id: 'f1-q4',
    title:
      'Você fez o teste do disjuntor? Ele ficou no mesmo lugar ou desligou de novo?',
    options: [
      {
        answer: 'Mesmo lugar',
      },
      {
        answer: 'Desligou de novo',
        nextQuestionId: 'f1-r1',
      },
    ],
  },
  {
    id: 'f1-r1',
    title:
      'Pelas informações que você passou, parece que você está com um defeito interno.',
    options: [
      {
        answer: 'Voltar',
      },
    ],
  },
];

const PowerOutageFlow: React.FC<FlowComponentProps> = ({
  modalOpen,
  toggleModal,
}) => {
  const [questions, setQuestions] = useState<Question[]>(powerOutageQuestions);
  const [currentQuestion, setCurrentQuestion] = useState(questions[0]);
  const [answers, setAnswers] = useState<Answer[]>([]);

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
