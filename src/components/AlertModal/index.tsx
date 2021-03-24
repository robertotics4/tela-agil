import React, { useCallback, useEffect, useRef, useState } from 'react';
import Rodal from 'rodal';
import { FiCheck, FiAlertTriangle, FiXCircle } from 'react-icons/fi';
import { GoInfo } from 'react-icons/go';

import 'rodal/lib/rodal.css';

import { AlertMessage } from '../../hooks/alert';

import {
  AlertContent,
  AlertTitle,
  AlertDescription,
  ButtonsContainer,
  ConfirmationButton,
  ConfirmationButtonText,
  CancelButton,
  CancelButtonText,
} from './styles';

interface AlertProps {
  message: AlertMessage;
  isOpen: boolean;
  setIsOpen: () => void;
}

const icons = {
  info: <GoInfo size={80} color="#0DC9F0" />,
  error: <FiXCircle size={80} color="#eb5757" />,
  success: <FiCheck size={80} color="#04d361" />,
  warning: <FiAlertTriangle size={80} color="#FFC105" />,
};

const AlertModal: React.FC<AlertProps> = ({ message, isOpen, setIsOpen }) => {
  const [alertStatus, setAlertStatus] = useState(false);

  useEffect(() => {
    setAlertStatus(isOpen);
  }, [isOpen]);

  const handleConfirmationClick = useCallback(async () => {
    if (message.confirmationAction) {
      message.confirmationAction();
    }

    setIsOpen();
  }, [setIsOpen, message]);

  const handleCancelClick = useCallback(() => {
    if (message.cancelAction) {
      message.cancelAction();
    }

    setIsOpen();
  }, [setIsOpen, message]);

  return (
    <Rodal
      visible={alertStatus}
      showCloseButton={false}
      customStyles={{
        borderRadius: '8px',
        padding: '48px 64px',
        width: '480px',
        height: 'fit-content',
      }}
      customMaskStyles={{
        background: 'rgba(0, 0, 0, 0.6)',
      }}
    >
      <AlertContent>
        {icons[message.type || 'info']}

        <AlertTitle>{message.title}</AlertTitle>
        <AlertDescription>{message.description}</AlertDescription>

        <ButtonsContainer>
          {message.cancelButtonText && (
            <CancelButton onClick={handleCancelClick}>
              <CancelButtonText>{message.cancelButtonText}</CancelButtonText>
            </CancelButton>
          )}

          <ConfirmationButton onClick={handleConfirmationClick}>
            <ConfirmationButtonText>
              {message.confirmationText}
            </ConfirmationButtonText>
          </ConfirmationButton>
        </ButtonsContainer>
      </AlertContent>
    </Rodal>
  );
};

export default AlertModal;
