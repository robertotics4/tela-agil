import React, { useState, useEffect, useCallback } from 'react';

import ReactModal from 'react-modal';

import {
  Content,
  OutlineButton,
  ModalTitle,
  QuestionTitle,
  QuestionContent,
} from './styles';

interface Option {
  answer: string;
  nextQuestionId?: string | undefined;
  action?(): void;
}

export interface Question {
  id: string;
  title: string;
  options: Option[];
}

interface ModalProps {
  title: string;
  question: Question;
  isOpen: boolean;
  setIsOpen: () => void;
  setCurrentQuestion(nextQuestionId: string): void;
  clearFlow(): void;
}

const Modal: React.FC<ModalProps> = ({
  title,
  question,
  isOpen,
  setIsOpen,
  setCurrentQuestion,
  clearFlow,
}) => {
  const [modalStatus, setModalStatus] = useState(isOpen);

  const handleClickOption = useCallback(
    (option: Option) => {
      if (option.nextQuestionId) {
        setCurrentQuestion(option.nextQuestionId);
      } else {
        setIsOpen();
      }
    },
    [setCurrentQuestion, setIsOpen],
  );

  useEffect(() => {
    setModalStatus(isOpen);
    clearFlow();
  }, [isOpen, clearFlow]);

  return (
    <ReactModal
      shouldCloseOnOverlayClick={!false}
      onRequestClose={setIsOpen}
      isOpen={modalStatus}
      ariaHideApp={false}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          background: '#F0F0F5',
          color: '#000000',
          borderRadius: '8px',
          width: '736px',
          padding: '48px',
          border: 'none',
        },
        overlay: {
          backgroundColor: 'rgba(0,0,0,0.7)',
        },
      }}
    >
      <Content>
        <ModalTitle>{title}</ModalTitle>

        <QuestionTitle>{question.title}</QuestionTitle>

        <QuestionContent>
          {question.options.map(option => (
            <OutlineButton
              type="button"
              onClick={() => handleClickOption(option)}
            >
              {option.answer}
            </OutlineButton>
          ))}
        </QuestionContent>
      </Content>
    </ReactModal>
  );
};

export default Modal;
