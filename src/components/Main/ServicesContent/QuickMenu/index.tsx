import React, { useState } from 'react';

import { BsLightningFill } from 'react-icons/bs';
import {
  FaPlug,
  FaDollarSign,
  FaDivide,
  FaCalendarAlt,
  FaListUl,
} from 'react-icons/fa';
import { IoDocumentText } from 'react-icons/io5';
import { IoMdMail } from 'react-icons/io';
import { MdReceipt } from 'react-icons/md';
import { useLoading } from 'react-use-loading';
import Swal from 'sweetalert2';

import {
  Container,
  Content,
  MenuItem,
  MenuItemButton,
  MenuItemText,
} from './styles';

import PowerOutageFlow from '../../../Services/PowerOutageFlow';
import DebitsConsultationModal from '../../../Services/DebitsConsultationModal';
import InstallmentPaymentModal from '../../../Services/InstallmentPaymentModal';
import EmailInvoice from '../../../Services/EmailInvoice';
import ExpirationChange from '../../../Services/DueDateChange';
import ServiceNotesList from '../../../Services/ServiceNotesList';
import MonitoringOfProtocols from '../../../Services/MonitoringOfProtocols';

import Loading from '../../../Loading';

import { useCustomerService } from '../../../../hooks/customerService';
import { usePowerReconnectionService } from '../../../../hooks/powerReconnectionService';
import { usePowerOutageService } from '../../../../hooks/powerOutageService';
import { useChangeDueDateService } from '../../../../hooks/changeDueDateService';
import { useMonitoringOfProtocols } from '../../../../hooks/monitoringOfProtocols';

const QuickMenu: React.FC = () => {
  const [outagePowerOpen, setOutagePowerOpen] = useState(false);
  const [debitsConsultationOpen, setDebitsConsultationOpen] = useState(false);
  const [installmentPaymentOpen, setInstallmentPaymentOpen] = useState(false);
  const [emailInvoiceOpen, setEmailInvoiceOpen] = useState(false);
  const [changeDueDateOpen, setChangeDueDateOpen] = useState(false);
  const [serviceNotesListOpen, setServiceNotesListOpen] = useState(false);
  const [monitoringOfProtocolsOpen, setMonitoringOfProtocolsOpen] = useState(
    false,
  );

  const {
    serviceNotes,
    debits,
    customer,
    installation,
    operatingCompany,
    protocol,
  } = useCustomerService();
  const { ableToPowerOutage } = usePowerOutageService();
  const {
    ableToReconnection,
    prepareForPowerReconnection,
  } = usePowerReconnectionService();

  const { ableToChangeDueDate } = useChangeDueDateService();

  const { protocols, getProtocolsList } = useMonitoringOfProtocols();

  const [
    { isLoading, message },
    { start: startLoading, stop: stopLoading },
  ] = useLoading();

  async function toggleOutagePower(): Promise<void> {
    if (
      await ableToPowerOutage({
        contractAccount: customer.contractAccount,
        installation,
        operatingCompany,
        protocol: protocol || '00',
        reference: customer.address.referencePoint
          ? customer.address.referencePoint
          : '',
        serviceNotes,
      })
    ) {
      setOutagePowerOpen(!outagePowerOpen);
    }
  }

  async function togglePowerReconnection(): Promise<void> {
    const responseAbleToReconnection = ableToReconnection({
      contractAccount: customer.contractAccount,
      serviceNotes,
      installation,
    });

    if (!responseAbleToReconnection.ok) {
      Swal.fire({
        icon: 'warning',
        title: 'Religa????o',
        html: `<p>${
          responseAbleToReconnection.error ||
          'O cliente n??o est?? habilitado para gerar uma religa????o'
        }</p>`,
        confirmButtonText: `OK`,
        confirmButtonColor: '#3c1490',
      });
    } else {
      await prepareForPowerReconnection({
        attendanceData: customer,
        installation,
        debits,
        operatingCompany,
        protocol: protocol || '00',
      });
    }
  }

  function toggleDebitsConsultation(): void {
    if (
      debits.installmentDebits.totalAmountInstallmentDebits === 0 &&
      debits.invoiceDebits.totalAmountInvoiceDebits === 0
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Consulta de d??bitos',
        html: '<p>O cliente n??o possui d??bitos</p>',
        confirmButtonText: `OK`,
        confirmButtonColor: '#3c1490',
      });
    } else {
      setDebitsConsultationOpen(!debitsConsultationOpen);
    }
  }

  function toggleInstallmentPayment(): void {
    if (!debits.installmentDebits.installmentDebitDetails.length) {
      Swal.fire({
        icon: 'warning',
        title: 'Parcelamento',
        html: '<p>O cliente n??o possui negocia????es de parcelamento</p>',
        confirmButtonText: `OK`,
        confirmButtonColor: '#3c1490',
      });
    } else {
      setInstallmentPaymentOpen(!installmentPaymentOpen);
    }
  }

  function toggleEmailInvoice(): void {
    if (!customer.contacts.email) {
      Swal.fire({
        icon: 'warning',
        title: 'Fatura por e-mail',
        html: '<p>O cliente n??o possui um e-mail cadastrado</p>',
        confirmButtonText: `OK`,
        confirmButtonColor: '#3c1490',
      });
    } else {
      setEmailInvoiceOpen(!emailInvoiceOpen);
    }
  }

  async function toggleChangeDueDate(): Promise<void> {
    if (!changeDueDateOpen) {
      startLoading('Verificando datas dispon??veis ...');

      const responseAbleToChangeDueDate = await ableToChangeDueDate({
        contractAccount: customer.contractAccount,
        stateCode: operatingCompany,
      });

      stopLoading();

      if (!responseAbleToChangeDueDate.ok) {
        Swal.fire({
          icon: 'warning',
          title: 'Altera????o de Data Certa',
          html: `<p>${
            responseAbleToChangeDueDate.error ||
            'O cliente n??o est?? habilitado para altera????o de Data Certa'
          }</p>`,
          confirmButtonText: `OK`,
          confirmButtonColor: '#3c1490',
        });
      } else {
        setChangeDueDateOpen(!changeDueDateOpen);
      }
    } else {
      setChangeDueDateOpen(!changeDueDateOpen);
    }
  }

  function toggleServiceNotesList(): void {
    if (
      !serviceNotes.openServiceNotes.length &&
      !serviceNotes.closedServiceNotes.length
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Notas de servi??o',
        html: '<p>O cliente n??o possui notas para serem exibidas.</p>',
        confirmButtonText: `OK`,
        confirmButtonColor: '#3c1490',
      });
    } else {
      setServiceNotesListOpen(!serviceNotesListOpen);
    }
  }

  async function toggleMonitoringOfProtocols(): Promise<void> {
    if (!monitoringOfProtocolsOpen) {
      try {
        startLoading('Carregando protocolos ...');

        const responseProtocols = await getProtocolsList({
          operatingCompany,
          contractAccount: customer.contractAccount,
        });

        if (!responseProtocols) {
          Swal.fire({
            icon: 'warning',
            title: 'Acompnhamento de Protocolos',
            html: 'O cliente n??o possui protocolos de atendimento',
            confirmButtonText: `OK`,
            confirmButtonColor: '#3c1490',
          });
        } else {
          setMonitoringOfProtocolsOpen(!monitoringOfProtocolsOpen);
        }
      } catch (err: any) {
        Swal.fire({
          icon: 'warning',
          title: 'Acompnhamento de Protocolos',
          html: `<p>${
            err.message || 'Falha ao carregar os protocolos do cliente'
          }</p>`,
          confirmButtonText: `OK`,
          confirmButtonColor: '#3c1490',
        });
      } finally {
        stopLoading();
      }
    } else {
      setMonitoringOfProtocolsOpen(!monitoringOfProtocolsOpen);
    }
  }

  return (
    <Container>
      <h3>Menu r??pido</h3>

      <Content>
        <MenuItem disabled>
          <MenuItemButton type="button" onClick={toggleOutagePower}>
            <BsLightningFill size={20} />
          </MenuItemButton>

          <MenuItemText>Falta de energia</MenuItemText>
        </MenuItem>

        <MenuItem disabled>
          <MenuItemButton type="button" onClick={togglePowerReconnection}>
            <FaPlug size={20} />
          </MenuItemButton>

          <MenuItemText>Religa????o</MenuItemText>
        </MenuItem>

        <MenuItem>
          <MenuItemButton type="button" onClick={toggleDebitsConsultation}>
            <IoDocumentText size={20} />
          </MenuItemButton>

          <MenuItemText>Consulta de d??bitos</MenuItemText>
        </MenuItem>

        {/* <MenuItem>
          <MenuItemButton type="button">
            <FaDollarSign size={20} />
          </MenuItemButton>

          <MenuItemText>Baixa Renda</MenuItemText>
        </MenuItem> */}

        <MenuItem>
          <MenuItemButton type="button" onClick={toggleInstallmentPayment}>
            <FaDivide size={20} />
          </MenuItemButton>

          <MenuItemText>Entrada de parcelamento</MenuItemText>
        </MenuItem>

        <MenuItem
          // disabled={!(operatingCompany === '98' || operatingCompany === '95')}
          disabled
        >
          <MenuItemButton type="button" onClick={toggleEmailInvoice}>
            <IoMdMail size={20} />
          </MenuItemButton>

          <MenuItemText>Fatura por e-mail</MenuItemText>
        </MenuItem>

        <MenuItem
          // disabled={!(operatingCompany === '98' || operatingCompany === '95')}
          disabled
        >
          <MenuItemButton type="button" onClick={toggleChangeDueDate}>
            <FaCalendarAlt size={20} />
          </MenuItemButton>

          <MenuItemText>Data certa</MenuItemText>
        </MenuItem>

        <MenuItem disabled>
          <MenuItemButton type="button" onClick={toggleServiceNotesList}>
            <FaListUl size={20} />
          </MenuItemButton>

          <MenuItemText>Notas de Servi??o</MenuItemText>
        </MenuItem>

        <MenuItem
          disabled={!(operatingCompany === '98' || operatingCompany === '95')}
        >
          <MenuItemButton type="button" onClick={toggleMonitoringOfProtocols}>
            <MdReceipt size={20} />
          </MenuItemButton>

          <MenuItemText>Acompanhamento de Protocolos</MenuItemText>
        </MenuItem>
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
        isOpen={changeDueDateOpen}
        setIsOpen={toggleChangeDueDate}
      />

      <ServiceNotesList
        isOpen={serviceNotesListOpen}
        setIsOpen={toggleServiceNotesList}
      />

      <MonitoringOfProtocols
        isOpen={monitoringOfProtocolsOpen}
        setIsOpen={toggleMonitoringOfProtocols}
      />

      {isLoading && (
        <Loading isOpen={isLoading} message={message} setIsOpen={stopLoading} />
      )}
    </Container>
  );
};

export default QuickMenu;
