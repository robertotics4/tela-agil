import React, { useState, useEffect } from 'react';
import Rodal from 'rodal';

import 'rodal/lib/rodal.css';

interface IModalProps {
  children: any;
  isOpen: boolean;
  customStyles?: object;
  setIsOpen: () => void;
}

const Modal: React.FC<IModalProps> = ({
  children,
  isOpen,
  setIsOpen,
  customStyles,
}) => {
  const [modalStatus, setModalStatus] = useState(isOpen);

  useEffect(() => {
    setModalStatus(isOpen);
  }, [isOpen]);

  return (
    <Rodal
      visible={modalStatus}
      showCloseButton
      closeOnEsc
      onClose={setIsOpen}
      customStyles={
        customStyles || {
          borderRadius: '8px',
          padding: '48px 64px',
          width: '736px',
          height: 'fit-content',
        }
      }
      customMaskStyles={{
        background: 'rgba(0, 0, 0, 0.6)',
      }}
    >
      {children}
    </Rodal>
  );
};

export default Modal;
