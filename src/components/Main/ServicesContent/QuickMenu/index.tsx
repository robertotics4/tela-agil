import React, { useState } from 'react';

import { BsLightningFill } from 'react-icons/bs';
import { FaPlug, FaDollarSign, FaDivide, FaCalendarAlt } from 'react-icons/fa';
import { IoDocumentText } from 'react-icons/io5';
import { IoMdMail } from 'react-icons/io';
import { MdReceipt } from 'react-icons/md';

import { Container, Content } from './styles';

import PowerOutageFlow from '../../../Services/PowerOutageFlow';
import DebitsConsultationModal from '../../../Services/DebitsConsultationModal';
import InstallmentPaymentModal from '../../../Services/InstallmentPaymentModal';
import EmailInvoice from '../../../Services/EmailInvoice';
import ExpirationChange from '../../../Services/ExpirationChange';

const QuickMenu: React.FC = () => {
  const [outagePowerOpen, setOutagePowerOpen] = useState(false);
  const [debitsConsultationOpen, setDebitsConsultationOpen] = useState(false);
  const [installmentPaymentOpen, setInstallmentPaymentOpen] = useState(false);
  const [emailInvoiceOpen, setEmailInvoiceOpen] = useState(false);
  const [expirationChangeOpen, setExpirationChangeOpen] = useState(false);

  function toggleOutagePower(): void {
    setOutagePowerOpen(!outagePowerOpen);
  }

  function toggleDebitsConsultation(): void {
    setDebitsConsultationOpen(!debitsConsultationOpen);
  }

  function toggleInstallmentPayment(): void {
    setInstallmentPaymentOpen(!installmentPaymentOpen);
  }

  function toggleEmailInvoice(): void {
    setEmailInvoiceOpen(!emailInvoiceOpen);
  }

  function toggleExpirationChange(): void {
    setExpirationChangeOpen(!expirationChangeOpen);
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
          <button type="button">
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
          <button type="button">
            <IoMdMail size={20} onClick={toggleEmailInvoice} />
          </button>

          <span>Fatura por e-mail</span>
        </div>

        <div>
          <button type="button">
            <FaCalendarAlt size={20} onClick={toggleExpirationChange} />
          </button>

          <span>Data certa</span>
        </div>

        <div>
          <button type="button">
            <MdReceipt size={20} />
          </button>

          <span>Protocolo</span>
        </div>
      </Content>

      <PowerOutageFlow
        modalOpen={outagePowerOpen}
        toggleModal={toggleOutagePower}
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
    </Container>
  );
};

export default QuickMenu;
