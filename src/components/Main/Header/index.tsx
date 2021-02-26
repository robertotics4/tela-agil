import React, { useCallback } from 'react';
import { BiTransfer } from 'react-icons/bi';

import {
  Container,
  Protocol,
  ImportantInfo,
  ButtonChangeContract,
} from './styles';

import { useCustomerService } from '../../../hooks/customerService';

import TagInfo from './TagInfo';

const Header: React.FC = () => {
  const { installation, debits, protocol } = useCustomerService();

  return (
    <Container>
      <Protocol>{`Protocolo: ${protocol}`}</Protocol>

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

      <ButtonChangeContract type="button">
        <BiTransfer />
        Trocar contrato
      </ButtonChangeContract>
    </Container>
  );
};

export default Header;
