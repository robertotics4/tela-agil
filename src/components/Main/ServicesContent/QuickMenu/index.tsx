import React, { useState } from 'react';
import { BsLightningFill } from 'react-icons/bs';
import { FaPlug } from 'react-icons/fa';

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
          <button type="button" onClick={togglePowerReconnection}>
            <FaPlug size={20} />
          </button>

          <span>Religação</span>
        </div>

        <div>
          <button type="button">
            <BsLightningFill size={20} />
          </button>

          <span>Falta de energia</span>
        </div>

        <div>
          <button type="button">
            <BsLightningFill size={20} />
          </button>

          <span>Falta de energia</span>
        </div>

        <div>
          <button type="button">
            <BsLightningFill size={20} />
          </button>

          <span>Falta de energia</span>
        </div>

        <div>
          <button type="button">
            <BsLightningFill size={20} />
          </button>

          <span>Falta de energia</span>
        </div>

        <div>
          <button type="button">
            <BsLightningFill size={20} />
          </button>

          <span>Falta de energia</span>
        </div>

        <div>
          <button type="button">
            <BsLightningFill size={20} />
          </button>

          <span>Falta de energia</span>
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
