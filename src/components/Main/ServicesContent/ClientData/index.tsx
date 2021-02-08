import React from 'react';

import { Container, Content } from './styles';

const ClientData: React.FC = () => {
  return (
    <Container>
      <h3>Dados do cliente</h3>

      <Content>
        <div>
          <label>
            NOME COMPLETO
            <p>Maria Ferreira da Silva Campos</p>
          </label>

          <label>
            FATURA POR E-MAIL
            <p>Sim</p>
          </label>

          <label>
            CPF
            <p>279.807.874-12</p>
          </label>

          <label>
            DATA DE NASCIMENTO
            <p>01/07/1957</p>
          </label>

          <label>
            PN
            <p>0065489</p>
          </label>

          <label>
            ENDEREÇO DO CLIENTE
            <p>
              Rua Campo Grande, nº 07, Centro, São Luís - MA, CEP: 65000-000.
              Próximo à quadra velha atrás da avenida Vitorino Freire
            </p>
          </label>
        </div>

        <div>
          <label>
            PERFIL DO CLIENTE
            <p>PF</p>
          </label>

          <label>
            TIPO DO PN
            <p>VARJ</p>
          </label>

          <label>
            CONTRATO(S) ATIVO(S)
            <p>1</p>
          </label>

          <label>
            APTO A NEGOCIAR
            <p>Sim</p>
          </label>

          <label>
            CELULAR
            <p>(98) 99999-9999</p>
          </label>

          <label>
            FIXO
            <p>(98) 3000-0000</p>
          </label>

          <label>
            E-MAIL
            <p>mariaferreira.silva@gmail.com</p>
          </label>
        </div>
      </Content>
    </Container>
  );
};

export default ClientData;
