import React, { useEffect, useState } from 'react';
import { FiCheck, FiAlertTriangle, FiXCircle } from 'react-icons/fi';
import ReactModal from 'react-modal';

import { AlertMessage } from '../../hooks/alert';

import {
  AlertContent,
  AlertTitle,
  AlertDescription,
  ConfirmationButton,
  ConfirmationButtonText,
} from './styles';

interface AlertProps {
  message: AlertMessage;
  isOpen: boolean;
  setIsOpen: () => void;
}

const icons = {
  info: <FiAlertTriangle size={80} color="#444444" />,
  error: <FiXCircle size={80} color="#eb5757" />,
  success: <FiCheck size={80} color="#04d361" />,
};

const AlertModal: React.FC<AlertProps> = ({ message, isOpen, setIsOpen }) => {
  const [alertStatus, setAlertStatus] = useState(false);

  useEffect(() => {
    setAlertStatus(isOpen);
  }, [isOpen]);

  return (
    <ReactModal
      shouldCloseOnOverlayClick={!false}
      isOpen={alertStatus}
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
          width: '480px',
          padding: '48px 64px',
          border: 'none',
        },
        overlay: {
          backgroundColor: 'rgba(0,0,0,0.7)',
        },
      }}
    >
      <AlertContent>
        {icons[message.type || 'info']}

        <AlertTitle>{message.title}</AlertTitle>
        <AlertDescription>{message.description}</AlertDescription>

        <ConfirmationButton onClick={setIsOpen}>
          <ConfirmationButtonText>
            {message.confirmationText}
          </ConfirmationButtonText>
        </ConfirmationButton>
      </AlertContent>
    </ReactModal>
  );
};

export default AlertModal;
