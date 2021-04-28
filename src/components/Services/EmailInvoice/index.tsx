import React, { useCallback, useEffect } from 'react';
import Swal from 'sweetalert2';
import { v4 as uuid } from 'uuid';

import { useLoading } from 'react-use-loading';
import { useCustomerService } from '../../../hooks/customerService';

import Loading from '../../Loading';
import Modal from '../../Modal';

import eqtlBarApi from '../../../services/eqtlBarApi';

import addZeroesToContract from '../../../utils/addZeroesToContract';

import { ModalContent, OptionsContainer, OptionButton } from './styles';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

interface RegisterInvoiceByEmailProps {
  contract: string;
  email: string;
  stateCode: string;
}

const EmailInvoiceModal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const [{ isLoading, message }, { start, stop }] = useLoading();

  const {
    customer,
    operatingCompany,
    registerServicePerformed,
  } = useCustomerService();

  const registerInvoiceByEmail = useCallback(
    async ({ contract, email, stateCode }: RegisterInvoiceByEmailProps) => {
      const response = await eqtlBarApi.post(
        '/fatura/v1/cadastrarFatura',
        {
          codigoTransacao: uuid(),
          data: {
            canalAtendimento: 'S',
            email,
            contaContrato: addZeroesToContract(contract, 12),
          },
        },
        {
          params: {
            flagAtualizaEmail: false,
            flagCadastroFatura: true,
            empresaOperadora: stateCode,
          },
        },
      );

      console.log(response.data);

      if (Object.keys(response.data.data).includes('codigoErro')) {
        if (response.data.data.codigoErro !== '00') {
          throw new Error(response.data.data.mensagem);
        }
      } else {
        throw new Error('Falha ao cadastrar a fatura por e-mail');
      }
    },
    [],
  );

  const handleClickAutorize = useCallback(async () => {
    try {
      start('Ativando serviço de fatura por e-mail..');

      await registerInvoiceByEmail({
        contract: customer.contractAccount,
        email: customer.contacts.email,
        stateCode: operatingCompany,
      });

      Swal.fire({
        icon: 'success',
        title: 'Fatura por e-mail',
        html: '<p>Serviço de fatura por e-mail ativado com sucesso.</p>',
        confirmButtonText: `OK`,
        confirmButtonColor: '#3c1490',
      });
    } catch (err) {
      Swal.fire({
        icon: 'warning',
        title: 'Fatura por e-mail',
        html: `<p>${err.message}</p>`,
        confirmButtonText: `OK`,
        confirmButtonColor: '#3c1490',
      });
    } finally {
      setIsOpen();
      stop();
    }
  }, [
    customer,
    operatingCompany,
    registerInvoiceByEmail,
    setIsOpen,
    start,
    stop,
  ]);

  useEffect(() => {
    if (isOpen) {
      registerServicePerformed({
        serviceName: 'Cadastro de fatura por e-mail',
        executionDate: new Date(),
      });
    }
  }, [registerServicePerformed, isOpen]);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
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

          <OptionButton type="button" onClick={handleClickAutorize}>
            Sim, autorizo
          </OptionButton>
        </OptionsContainer>
      </ModalContent>

      {isLoading && (
        <Loading isOpen={isLoading} message={message} setIsOpen={stop} />
      )}
    </Modal>
  );
};

export default EmailInvoiceModal;
