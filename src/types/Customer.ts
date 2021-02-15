import Address from './Address';
import { Contacts } from './Contacts';

interface Customer {
  contractAccount: string;
  name: string;
  surname: string;
  motherName: string;
  dayOfBirth: Date;
  rg: string | null;
  cpf: string;
  contacts: Contacts;
  address: Address;
  phaseNumber: number;
  bp: string;
  installationNumber: string;
}

export default Customer;
