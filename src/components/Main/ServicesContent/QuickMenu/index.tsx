import React, { useState } from 'react';

import { BsLightningFill } from 'react-icons/bs';
import { FaPlug, FaDollarSign, FaDivide, FaCalendarAlt } from 'react-icons/fa';
import { IoDocumentText } from 'react-icons/io5';
import { IoMdMail } from 'react-icons/io';
import { MdReceipt } from 'react-icons/md';

import { Container, Content } from './styles';

import PowerOutageFlow from '../../../Services/PowerOutageFlow';
import PowerReconnectionFlow from '../../../Services/PowerReconnectionFlow';
import DebitsConsultationModal from '../../../Services/DebitsConsultationModal';
import InstallmentPaymentModal from '../../../Services/InstallmentPaymentModal';
import EmailInvoice from '../../../Services/EmailInvoice';
import ExpirationChange from '../../../Services/DueDateChange';
import RequestList from '../../../Services/RequestList';

import { useCustomerService } from '../../../../hooks/customerService';
import { useAlert } from '../../../../hooks/alert';
import { usePowerReconnectionService } from '../../../../hooks/powerReconnectionService';
import { usePowerOutageService } from '../../../../hooks/powerOutageService';

const QuickMenu: React.FC = () => {
  const [outagePowerOpen, setOutagePowerOpen] = useState(false);
  const [powerReconnectionOpen, setPowerReconnectionOpen] = useState(false);
  const [debitsConsultationOpen, setDebitsConsultationOpen] = useState(false);
  const [installmentPaymentOpen, setInstallmentPaymentOpen] = useState(false);
  const [emailInvoiceOpen, setEmailInvoiceOpen] = useState(false);
  const [expirationChangeOpen, setExpirationChangeOpen] = useState(false);
  const [requestListOpen, setRequestListOpen] = useState(false);

  const { customAlert } = useAlert();
  const {
    serviceNotes,
    debits,
    customer,
    installation,
    operatingCompany,
    protocol,
  } = useCustomerService();
  const { ableToPowerOutage } = usePowerOutageService();
  const {
    ableToReconnection,
    startPowerReconnectionFlow,
  } = usePowerReconnectionService();

  async function toggleOutagePower(): Promise<void> {
    if (
      await ableToPowerOutage({
        contractAccount: customer.contractAccount,
        installation,
        operatingCompany,
        protocol: protocol || '00',
        reference: customer.address.referencePoint
          ? customer.address.referencePoint
          : '',
        serviceNotes,
      })
    ) {
      setOutagePowerOpen(!outagePowerOpen);
    }
  }

  async function togglePowerReconnection(): Promise<void> {
    await startPowerReconnectionFlow({
      attendanceData: customer,
      installation,
      debits,
      operatingCompany,
    });
    // const responseAbleToReconnection = ableToReconnection({
    //   contractAccount: customer.contractAccount,
    //   serviceNotes,
    //   installation,
    // });

    // if (!responseAbleToReconnection.ok) {
    //   customAlert({
    //     type: 'warning',
    //     title: 'Religação',
    //     description:
    //       responseAbleToReconnection.error ||
    //       'O cliente não está habilitado para gerar uma religação',
    //     confirmationText: 'OK',
    //   });
    // } else {
    //   generatePowerReconnection({
    //     contractAccount: customer.contractAccount,
    //     debits,
    //   });
    // }
  }

  function toggleDebitsConsultation(): void {
    if (
      debits.installmentDebits.totalAmountInstallmentDebits === 0 &&
      debits.invoiceDebits.totalAmountInvoiceDebits === 0
    ) {
      customAlert({
        type: 'warning',
        title: 'Consulta de débitos',
        description: 'O cliente não possui débitos',
        confirmationText: 'OK',
      });
    } else {
      setDebitsConsultationOpen(!debitsConsultationOpen);
    }
  }

  function toggleInstallmentPayment(): void {
    if (!debits.installmentDebits.installmentDebitDetails.length) {
      customAlert({
        type: 'warning',
        title: 'Parcelamento',
        description: 'O cliente não possui negociações de parcelamento',
        confirmationText: 'OK',
      });
    } else {
      setInstallmentPaymentOpen(!installmentPaymentOpen);
    }
  }

  function toggleEmailInvoice(): void {
    if (!customer.contacts.email) {
      customAlert({
        type: 'warning',
        title: 'Fatura por e-mail',
        description: 'O cliente não possui um e-mail cadastrado',
        confirmationText: 'OK',
      });
    }
    setEmailInvoiceOpen(!emailInvoiceOpen);
  }

  function toggleExpirationChange(): void {
    setExpirationChangeOpen(!expirationChangeOpen);
  }

  function toggleRequestList(): void {
    if (
      !serviceNotes.openServiceNotes.length &&
      !serviceNotes.closedServiceNotes.length
    ) {
      customAlert({
        type: 'info',
        title: 'Acompanhamento de protocolos',
        description: 'O cliente não possui notas para serem exibidas.',
        confirmationText: 'OK',
      });
    } else {
      setRequestListOpen(!requestListOpen);
    }
  }

  return (
    <Container>
      <h3>Menu rápido</h3>

      <Content>
        <div>
          <button type="button" onClick={toggleOutagePower}>
            <BsLightningFill size={20} />
          </button>

          <span>Falta de energia</span>
        </div>

        <div>
          <button type="button" onClick={togglePowerReconnection}>
            <FaPlug size={20} />
          </button>

          <span>Religação</span>
        </div>

        <div>
          <button type="button" onClick={toggleDebitsConsultation}>
            <IoDocumentText size={20} />
          </button>

          <span>Consulta de débitos</span>
        </div>

        <div>
          <button type="button">
            <FaDollarSign size={20} />
          </button>

          <span>Baixa Renda</span>
        </div>

        <div>
          <button type="button" onClick={toggleInstallmentPayment}>
            <FaDivide size={20} />
          </button>

          <span>Entrada de parcelamento</span>
        </div>

        <div>
          <button type="button" onClick={toggleEmailInvoice}>
            <IoMdMail size={20} />
          </button>

          <span>Fatura por e-mail</span>
        </div>

        <div>
          <button type="button" onClick={toggleExpirationChange}>
            <FaCalendarAlt size={20} />
          </button>

          <span>Data certa</span>
        </div>

        <div>
          <button type="button" onClick={toggleRequestList}>
            <MdReceipt size={20} />
          </button>

          <span>Acompanhamento de protocolos</span>
        </div>
      </Content>

      <PowerOutageFlow
        modalOpen={outagePowerOpen}
        toggleModal={toggleOutagePower}
      />

      <PowerReconnectionFlow
        modalOpen={powerReconnectionOpen}
        toggleModal={togglePowerReconnection}
      />

      <DebitsConsultationModal
        isOpen={debitsConsultationOpen}
        setIsOpen={toggleDebitsConsultation}
      />
      <InstallmentPaymentModal
        isOpen={installmentPaymentOpen}
        setIsOpen={toggleInstallmentPayment}
      />

      <EmailInvoice isOpen={emailInvoiceOpen} setIsOpen={toggleEmailInvoice} />

      <ExpirationChange
        isOpen={expirationChangeOpen}
        setIsOpen={toggleExpirationChange}
      />

      <RequestList isOpen={requestListOpen} setIsOpen={toggleRequestList} />
    </Container>
  );
};

export default QuickMenu;
