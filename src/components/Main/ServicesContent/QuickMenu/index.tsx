import React from 'react';
import { FiZap } from 'react-icons/fi';

import { Container, Content } from './styles';

const QuickMenu: React.FC = () => {
  return (
    <Container>
      <h3>Menu rápido</h3>

      <Content>
        <div>
          <button type="button">
            <FiZap color="#fff" size={20} />
          </button>

          <span>Falta de energia</span>
        </div>

        <div>
          <button type="button">
            <FiZap color="#fff" size={20} />
          </button>

          <span>Falta de energia</span>
        </div>

        <div>
          <button type="button">
            <FiZap color="#fff" size={20} />
          </button>

          <span>Falta de energia</span>
        </div>

        <div>
          <button type="button">
            <FiZap color="#fff" size={20} />
          </button>

          <span>Falta de energia</span>
        </div>

        <div>
          <button type="button">
            <FiZap color="#fff" size={20} />
          </button>

          <span>Falta de energia</span>
        </div>

        <div>
          <button type="button">
            <FiZap color="#fff" size={20} />
          </button>

          <span>Falta de energia</span>
        </div>

        <div>
          <button type="button">
            <FiZap color="#fff" size={20} />
          </button>

          <span>Falta de energia</span>
        </div>

        <div>
          <button type="button">
            <FiZap color="#fff" size={20} />
          </button>

          <span>Falta de energia</span>
        </div>
      </Content>
    </Container>
  );
};

export default QuickMenu;
