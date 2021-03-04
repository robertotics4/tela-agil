import React, { useState, useEffect, useCallback } from 'react';
import Rodal from 'rodal';
import { useLoading } from 'react-use-loading';

import 'rodal/lib/rodal.css';

import Loading from '../../../Loading';

import { useAuth } from '../../../../hooks/auth';
import { useCustomerService } from '../../../../hooks/customerService';
import { usePowerOutageService } from '../../../../hooks/powerOutageService';
import { useAlert } from '../../../../hooks/alert';

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
  action?: string;
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

const PowerReconnectionModal: React.FC<ModalProps> = ({
  title,
  question,
  isOpen,
  setIsOpen,
  setCurrentQuestion,
  clearFlow,
}) => {
  const [modalStatus, setModalStatus] = useState(isOpen);

  const { generatePowerOutageService } = usePowerOutageService();
  const { customer, operatingCompany, protocol } = useCustomerService();
  const { user } = useAuth();
  const { customAlert } = useAlert();

  const [{ isLoading, message }, { start, stop }] = useLoading();

  const callPowerReconnectionService = useCallback(async (action: string) => {},
  []);

  const handleClickOption = useCallback(
    (option: Option) => {
      if (option.nextQuestionId) {
        setCurrentQuestion(option.nextQuestionId);
      } else if (option.action) {
        callPowerReconnectionService(option.action);
      } else {
        setIsOpen();
      }
    },
    [setCurrentQuestion, callPowerReconnectionService, setIsOpen],
  );

  useEffect(() => {
    setModalStatus(isOpen);
    clearFlow();
  }, [isOpen, clearFlow]);

  return (
    <Rodal
      visible={modalStatus}
      showCloseButton
      closeOnEsc
      onClose={setIsOpen}
      customStyles={{
        borderRadius: '8px',
        padding: '48px 64px',
        width: '736px',
        height: 'fit-content',
      }}
      customMaskStyles={{
        background: 'rgba(0, 0, 0, 0.6)',
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

      {isLoading && (
        <Loading isOpen={isLoading} message={message} setIsOpen={stop} />
      )}
    </Rodal>
  );
};

export default PowerReconnectionModal;
