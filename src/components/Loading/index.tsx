import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import Spinner from 'react-spinkit';

import { Content } from './styles';

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
  setIsOpen: () => void;
}

const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  message,
  setIsOpen,
}) => {
  const [modalStatus, setModalStatus] = useState(isOpen);

  useEffect(() => {
    setModalStatus(isOpen);
  }, [isOpen]);

  return (
    <ReactModal
      shouldCloseOnOverlayClick={!false}
      onRequestClose={setIsOpen}
      isOpen={modalStatus}
      ariaHideApp={false}
      style={{
        content: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'transparent',
          border: 'none',
        },
        overlay: {
          backgroundColor: 'rgba(0,0,0,0.7)',
        },
      }}
    >
      <Content>
        <Spinner name="ball-pulse-sync" fadeIn="none" color="#fff" />
        <h2>{message}</h2>
      </Content>
    </ReactModal>
  );
};

export default LoadingModal;
