import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { useCustomerService } from '../../../../hooks/customerService';

import { Container, Content } from './styles';

const ClientData: React.FC = () => {
  const { customer } = useCustomerService();

  const formattedFullName = useMemo(() => {
    const fullName = customer.surname
      ? `${customer.name} ${customer.surname}`
      : customer.name;

    return fullName;
  }, [customer.name, customer.surname]);

  const formattedDayOfBirth = useMemo(() => {
    try {
      const dayOfBirth = format(new Date(customer.dayOfBirth), 'dd/MM/yyyy');
      return dayOfBirth;
    } catch {
      return '-';
    }
  }, [customer.dayOfBirth]);

  const formattedAddress = useMemo(() => {
    const { address } = customer;

    const complement = address.complement ? `, ${address.complement}` : '';
    const referencePoint = address.referencePoint
      ? `, ${address.referencePoint}`
      : '';

    return `${address.publicArea}, Nº ${address.number}, ${address.neighborhood}${complement}, ${address.city} - ${address.uf}, CEP: ${address.postalCode}. ${referencePoint}`;
  }, [customer]);

  const formattedLandlines = useMemo(() => {
    if (customer.contacts.phones) {
      const landlines = customer.contacts.phones.landline.map((item, index) => {
        if (index > 0) {
          return `/ ${item}`;
        }

        return item;
      });

      return landlines;
    }

    return '-';
  }, [customer.contacts.phones]);

  const formattedCellPhones = useMemo(() => {
    if (customer.contacts.phones) {
      const cellPhones = customer.contacts.phones.cellPhone.map(
        (item, index) => {
          if (index > 0) {
            return ` / ${item}`;
          }

          return item;
        },
      );

      return cellPhones;
    }

    return '-';
  }, [customer.contacts.phones]);

  return (
    <Container>
      <h3>Dados do cliente</h3>

      <Content>
        <div>
          <label>
            NOME COMPLETO
            <p>{formattedFullName}</p>
          </label>

          <label>
            NOME DA MÃE
            <p>{customer.motherName ? customer.motherName : ''}</p>
          </label>

          <label>
            CPF
            <p>{customer.cpf}</p>
          </label>

          <label>
            RG
            <p>{customer.rg}</p>
          </label>

          <label>
            DATA DE NASCIMENTO
            <p>{formattedDayOfBirth}</p>
          </label>

          <label>
            PN
            <p> </p>
          </label>

          <label>
            ENDEREÇO DO CLIENTE
            <p>{formattedAddress}</p>
          </label>
        </div>

        <div>
          <label>
            PERFIL DO CLIENTE
            <p> </p>
          </label>

          <label>
            TIPO DO PN
            <p> </p>
          </label>

          <label>
            CONTRATO(S) ATIVO(S)
            <p> </p>
          </label>

          <label>
            APTO A NEGOCIAR
            <p> </p>
          </label>

          <label>
            CELULAR
            <p>{formattedCellPhones}</p>
          </label>

          <label>
            FIXO
            <p>{formattedLandlines}</p>
          </label>

          <label>
            E-MAIL
            <p>{customer.contacts.email}</p>
          </label>
        </div>
      </Content>
    </Container>
  );
};

export default ClientData;
