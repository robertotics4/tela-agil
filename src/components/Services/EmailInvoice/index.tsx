import React from 'react';
import { useLoading } from 'react-use-loading';

import { useToast } from '../../../hooks/toast';
import { useCustomerService } from '../../../hooks/customerService';

import Loading from '../../Loading';
import Modal from '../../Modal';
import { OutlineButton } from '../../StepModal/styles';

import { ModalContent, OptionsContainer, OptionButton } from './styles';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

const EmailInvoiceModal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const [{ isLoading, message }, { start, stop }] = useLoading();

  const { customer } = useCustomerService();
  const { addToast } = useToast();

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      {customer.contacts.email ? (
        <ModalContent>
          <h2>Fatura por e-mail</h2>
          <p>
            {`Autorizo o envio mensal das faturas de energia elétrica e de eventuais
          notificações referentes à conta contrato especificada, ao e-mail do
          meu cadastro: ${customer.contacts.email}, dispensando a necessidade de envio
          impresso em papel.`}
          </p>

          <OptionsContainer>
            <OptionButton type="button" onClick={() => setIsOpen()}>
              Não
            </OptionButton>

            <OptionButton type="button">Sim, autorizo</OptionButton>
          </OptionsContainer>
        </ModalContent>
      ) : (
        <p>O usuário não possui e-mail cadastrado.</p>
      )}

      {isLoading && (
        <Loading isOpen={isLoading} message={message} setIsOpen={stop} />
      )}
    </Modal>
  );
};

export default EmailInvoiceModal;
