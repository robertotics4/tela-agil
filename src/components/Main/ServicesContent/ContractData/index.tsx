import React, { useMemo } from 'react';

import { Container, Content } from './styles';

import { useCustomerService } from '../../../../hooks/customerService';

const ContractData: React.FC = () => {
  const { customer, installation } = useCustomerService();

  const formattedContractStatus = useMemo(() => {
    return installation.status === 'Ligada' ? 'Ativo' : 'Inativo';
  }, [installation.status]);

  return (
    <Container>
      <h3>Dados da conta contrato</h3>

      <Content>
        <div>
          <label>
            INSTALAÇÃO
            <p>{customer.installationNumber}</p>
          </label>

          <label>
            SUBCLASSE
            <p>{installation.technicalData.subclass}</p>
          </label>

          <label>
            STATUS DA INSTALAÇÃO
            <p>{installation.status}</p>
          </label>

          <label>
            STATUS DO CONTRATO
            <p>{formattedContractStatus}</p>
          </label>

          <label>
            BAIXA RENDA
            <p> </p>
          </label>

          <label>
            CONSUMO IRREGULAR
            <p> </p>
          </label>

          <label>
            DESLIGAMENTO PROGRAMADO
            <p>{installation.scheduledShutdown ? 'Sim' : 'Não'}</p>
          </label>

          <label>
            CONSUMO MÉDIO (12 MESES)
            <p> </p>
          </label>
        </div>
      </Content>
    </Container>
  );
};

export default ContractData;
