import React, { useState, useEffect } from 'react';
import Rodal from 'rodal';
import Spinner from 'react-spinkit';

import 'rodal/lib/rodal.css';

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
    <Rodal
      visible={modalStatus}
      showCloseButton={false}
      customStyles={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        width: 'fit-content',
      }}
      customMaskStyles={{
        background: 'rgba(0, 0, 0, 0.6)',
      }}
    >
      <Content>
        <Spinner name="ball-pulse-sync" fadeIn="none" color="#fff" />
        <h2>{message}</h2>
      </Content>
    </Rodal>
  );
};

export default LoadingModal;
