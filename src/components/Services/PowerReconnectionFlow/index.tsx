import React, { useCallback, useState } from 'react';

import DebitsValidationModal, { Question } from './DebitsValidationModal';

import { currencyMask } from '../../../utils/inputMasks';

import { useCustomerService } from '../../../hooks/customerService';

interface FlowComponentProps {
  modalOpen: boolean;
  toggleModal(): void;
}

const PowerReconnectionFlow: React.FC<FlowComponentProps> = ({
  modalOpen,
  toggleModal,
}) => {
  const { debits } = useCustomerService();

  const powerReconnectionQuestions: Question[] = [
    {
      id: 'f1-q1',
      title: `Você possui ${
        debits.invoiceDebits.invoiceDebitDetails.length
      } faturas com um débito de ${currencyMask(
        debits.invoiceDebits.totalAmountInvoiceDebits,
      )}. Estão pagas?`,
      options: [
        {
          answer: 'Sim',
          action: 'valida-religa-urgencia',
        },
        {
          answer: 'Não',
          nextQuestionId: 'resposta-efetue-pagamento',
        },
      ],
    },
    {
      id: 'f1-q2',
      title: `Você possui débitos de parcelamento com entrada de ${currencyMask(
        debits.installmentDebits.totalAmountInstallmentDebits,
      )}. Estão pagos?`,
      options: [
        {
          answer: 'Sim',
          action: 'valida-religa-urgencia',
        },
        {
          answer: 'Não',
          nextQuestionId: 'resposta-efetue-pagamento',
        },
      ],
    },
    {
      id: 'resposta-efetue-pagamento',
      title: 'Efetue o pagamento e retorne para solicitar a religação.',
      options: [
        {
          answer: 'Sair',
        },
      ],
    },
  ];

  const [questions, setQuestions] = useState<Question[]>(
    powerReconnectionQuestions,
  );
  const [currentQuestion, setCurrentQuestion] = useState(
    debits.invoiceDebits.totalAmountInvoiceDebits > 0
      ? questions[0]
      : questions[1],
  );

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
    <>
      {debits.invoiceDebits.totalAmountInvoiceDebits > 0 ||
      debits.installmentDebits.totalAmountInstallmentDebits > 0 ? (
        <DebitsValidationModal
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          title="Religação"
          question={currentQuestion}
          setCurrentQuestion={handleSetCurrentQuestion}
          clearFlow={handleClearFlow}
        />
      ) : null}
    </>
  );
};

export default PowerReconnectionFlow;
