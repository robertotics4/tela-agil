import React, { useState } from 'react';
import { BsLightningFill } from 'react-icons/bs';

import { Container, Content } from './styles';

import PowerOutageFlow from '../../../StepModal/PowerOutageFlow';

const QuickMenu: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  return (
    <Container>
      <h3>Menu rápido</h3>

      <Content>
        <div>
          <button type="button" onClick={toggleModal}>
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

      <PowerOutageFlow modalOpen={modalOpen} toggleModal={toggleModal} />
    </Container>
  );
};

export default QuickMenu;
