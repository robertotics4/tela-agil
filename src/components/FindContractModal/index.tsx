import React, { useMemo } from 'react';
import { Column } from 'react-table';
import { useCustomerService } from '../../hooks/customerService';

import Modal from '../Modal';
import Table from './ContractsTable';

import { ModalContent, Title } from './styles';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

interface Contract {
  contractAccount: string;
  address: string;
}

const FindContractModal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const { contracts } = useCustomerService();

  const columns: Column<Contract>[] = useMemo(
    () =>
      [
        {
          Header: 'Conta contrato',
          accessor: 'contractAccount',
        },
        {
          Header: 'Endereço',
          accessor: 'address',
        },
      ] as Column<Contract>[],
    [],
  );

  const data = useMemo(() => {
    const mappedData = contracts?.map(
      contract =>
        ({
          contractAccount: contract.contractAccount,
          address: `${contract.address.publicArea}, ${contract.address.number}, ${contract.address.neighborhood}, ${contract.address.city} - ${contract.address.uf}, CEP ${contract.address.postalCode}`,
        } as Contract),
    );

    return mappedData;
  }, [contracts]);

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      customStyles={{
        borderRadius: '8px',
        padding: '48px 0',
        width: 'fit-content',
        height: 'fit-content',
      }}
    >
      <ModalContent>
        <Title>Acompanhamento de protocolos</Title>

        {/* <Table columns={columns} data={data} /> */}
      </ModalContent>
    </Modal>
  );
};

export default FindContractModal;
