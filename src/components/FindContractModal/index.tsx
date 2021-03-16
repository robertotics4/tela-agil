import React from 'react';

import { useCustomerService } from '../../hooks/customerService';

import Modal from '../Modal';
import ContractsTable from './ContractsTable';

import { ModalContent, OwnerContainer, OwnerLabel, OwnerName } from './styles';

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

  const data: Contract[] = contracts.map(contract => ({
    contractAccount: contract.contractAccount,
    address: `${contract.address.publicArea}, ${contract.address.number}, ${contract.address.neighborhood}, ${contract.address.city} - ${contract.address.uf}, CEP ${contract.address.postalCode}`,
  }));

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
        <OwnerContainer>
          {/* <OwnerLabel>Nome do titular:</OwnerLabel> */}
          {/* <OwnerName>{contracts && contracts[0].owner}</OwnerName> */}
        </OwnerContainer>

        <ContractsTable data={data} closeModal={setIsOpen} />
      </ModalContent>
    </Modal>
  );
};

export default FindContractModal;
