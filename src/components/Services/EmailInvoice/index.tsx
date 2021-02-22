import React from 'react';
import { useLoading } from 'react-use-loading';

import { useToast } from '../../../hooks/toast';

import Loading from '../../Loading';
import Modal from '../../Modal';
import { OutlineButton } from '../../StepModal/styles';

import { ModalContent, OptionsContainer, OptionButton } from './styles';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

const EmailInvoiceModal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const { addToast } = useToast();
  const [{ isLoading, message }, { start, stop }] = useLoading();

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalContent>
        <h2>Fatura por e-mail</h2>

        <p>
          Autorizo o envio mensal das faturas de energia elétrica e de eventuais
          notificações referentes à conta contrato especificada, ao e-mail do
          meu cadastro: roberto@email.com, dispensando a necessidade de envio
          impresso em papel.
        </p>

        <OptionsContainer>
          <OptionButton type="button">Não</OptionButton>
          <OptionButton type="button">Sim, autorizo</OptionButton>
        </OptionsContainer>
      </ModalContent>

      {isLoading && (
        <Loading isOpen={isLoading} message={message} setIsOpen={stop} />
      )}
    </Modal>
  );
};

export default EmailInvoiceModal;
