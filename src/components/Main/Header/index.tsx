import React, { useEffect } from 'react';
import { BiTransfer } from 'react-icons/bi';
import Spinner from 'react-spinkit';

import {
  Container,
  ProtocolContainer,
  ProtocolText,
  LoadingProtocolContainer,
  LoadingProtocolText,
  ImportantInfo,
  ButtonChangeContract,
} from './styles';

import { useCustomerService } from '../../../hooks/customerService';

import TagInfo from './TagInfo';

const Header: React.FC = () => {
  const {
    installation,
    debits,
    generateProtocol,
    protocol,
    operatingCompany,
    customer,
  } = useCustomerService();

  useEffect(() => {
    async function loadProtocol() {
      await generateProtocol({
        contractAccount: customer.contractAccount,
        operatingCompany,
      });
    }

    loadProtocol();
  }, [customer.contractAccount, generateProtocol, operatingCompany]);

  return (
    <Container>
      <ProtocolContainer>
        {protocol ? (
          <ProtocolText>{`Protocolo: ${protocol}`}</ProtocolText>
        ) : (
          <LoadingProtocolContainer>
            <LoadingProtocolText>Carregando protocolo</LoadingProtocolText>
            <Spinner name="circle" fadeIn="none" color="#000" />
          </LoadingProtocolContainer>
        )}
      </ProtocolContainer>

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
          message="Desliga em andamento"
        />
        <TagInfo
          type={installation.scheduledShutdown ? 'error' : 'success'}
          message="Desligamento programado"
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
