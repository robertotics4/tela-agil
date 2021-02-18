import React, { useState } from 'react';

import { BsLightningFill } from 'react-icons/bs';
import { FaPlug, FaDollarSign, FaDivide, FaCalendarAlt } from 'react-icons/fa';
import { IoDocumentText } from 'react-icons/io5';
import { IoMdMail } from 'react-icons/io';
import { MdReceipt } from 'react-icons/md';

import { Container, Content } from './styles';

import PowerOutageFlow from '../../../Services/PowerOutageFlow';
import DebitsConsultationModal from '../../../Services/DebitsConsultationModal';

const QuickMenu: React.FC = () => {
  const [outagePowerOpen, setOutagePowerOpen] = useState(false);
  const [powerReconnection, setPowerReconnection] = useState(false);

  function toggleOutagePower(): void {
    setOutagePowerOpen(!outagePowerOpen);
  }

  function togglePowerReconnection(): void {
    setPowerReconnection(!powerReconnection);
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
          <button type="button" onClick={togglePowerReconnection}>
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
          <button type="button">
            <FaDivide size={20} />
          </button>

          <span>Entrada de parcelamento</span>
        </div>

        <div>
          <button type="button">
            <IoMdMail size={20} />
          </button>

          <span>Fatura por e-mail</span>
        </div>

        <div>
          <button type="button">
            <FaCalendarAlt size={20} />
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
        isOpen={powerReconnection}
        setIsOpen={togglePowerReconnection}
      />
    </Container>
  );
};

export default QuickMenu;
