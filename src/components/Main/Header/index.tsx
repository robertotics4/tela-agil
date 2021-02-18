import React from 'react';
import { BiTransfer } from 'react-icons/bi';

import { Container, ImportantInfo } from './styles';

import { useCustomerService } from '../../../hooks/customerService';

import TagInfo from './TagInfo';

const Header: React.FC = () => {
  const { installation, debits } = useCustomerService();

  return (
    <Container>
      <h2>Protocolo: 9568163182</h2>

      <ImportantInfo>
        <TagInfo
          type={
            debits.invoiceDebits.totalAmountInvoiceDebits > 0
              ? 'error'
              : 'success'
          }
          message="Com débitos"
        />
        <TagInfo
          type={
            installation.individualPowerOutage ||
            installation.collectivePowerOutage ||
            installation.powerPhaseOutage
              ? 'error'
              : 'success'
          }
          message="Falta de energia"
        />
        <TagInfo
          type={installation.turnOffInProgress ? 'error' : 'success'}
          message="Sem desliga em andamento"
        />
        <TagInfo
          type={installation.scheduledShutdown ? 'error' : 'success'}
          message="Sem desligamento programado"
        />
      </ImportantInfo>

      <button type="button">
        <BiTransfer />
        Trocar unidade
      </button>
    </Container>
  );
};

export default Header;
