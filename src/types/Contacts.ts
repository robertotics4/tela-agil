export interface Phone {
  type: string;
  number: string;
}

export interface Contacts {
  phones: Phone[];
  email: string;
}
