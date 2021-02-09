import React from 'react';

import { Container, Content } from './styles';

const ContractData: React.FC = () => {
  return (
    <Container>
      <h3>Dados da conta contrato</h3>

      <Content>
        <div>
          <label>
            INSTALAÇÃO
            <p>02345345924</p>
          </label>

          <label>
            CLASSE
            <p>RESIDENCIAL</p>
          </label>

          <label>
            STATUS DA INSTALAÇÃO
            <p>Desliga em andamento</p>
          </label>

          <label>
            STATUS DO CONTRATO
            <p>Ativo</p>
          </label>

          <label>
            BAIXA RENDA
            <p>Não</p>
          </label>

          <label>
            CONSUMO IRREGULAR
            <p>Não</p>
          </label>

          <label>
            DESLIGAMENTO PROGRAMADO
            <p>Não</p>
          </label>

          <label>
            CONSUMO MÉDIO (12 MESES)
            <p>1727 kWh</p>
          </label>
        </div>
      </Content>
    </Container>
  );
};

export default ContractData;
