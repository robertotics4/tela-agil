import Address from './Address';
import { Contacts } from './Contacts';

interface Customer {
  name: string;
  emailInvoice: boolean;
  cpf: string;
  rg: string;
  dayOfBirth: Date;
  pn: string;
  address: Address;
  profile: string;
  pnType: string;
  numberOfActiveContracts: number;
  ableToNegotiate: boolean;
  contacts: Contacts;
}

export default Customer;
