import React, { useCallback } from 'react';

import { Container, RCTable } from './styles';

import { useCustomerService } from '../../../hooks/customerService';

const ContractsTable: React.FC = () => {
  const { contracts } = useCustomerService();

  const data = contracts.map(contract => ({
    contractAccount: contract.contractAccount,
    address: `${contract.address.publicArea}, ${contract.address.number}, ${contract.address.neighborhood}, ${contract.address.city} - ${contract.address.uf}, CEP ${contract.address.postalCode}`,
  }));

  const columns = [
    {
      title: 'Conta contrato',
      dataIndex: 'contractAccount',
      key: 'contractAccount',
    },
    {
      title: 'Endereço',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const onRowClick = useCallback((record, index, event) => {
    console.log(record);
  }, []);

  return (
    <Container>
      <RCTable
        columns={columns}
        data={data}
        tableLayout="auto"
        onRow={(record, index) => ({
          onClick: onRowClick.bind(null, record, index),
        })}
      />
    </Container>
  );
};

export default ContractsTable;
