export interface InvoiceDebit {
  overdueInvoiceNumber: string;
  dueDate: Date;
  invoiceAmount: number;
  invoiceReference: string;
  paymentCode: string;
}

export interface InstallmentDebit {
  billingDocumentNumber: string;
  invoiceAmount: number;
  invoiceReference?: string;
  paymentCode: string;
}

interface Debits {
  invoiceDebits: {
    invoiceDebitDetails: InvoiceDebit[];
    totalAmountInvoiceDebits: number;
  };
  installmentDebits: {
    installmentDebitDetails: InstallmentDebit[];
    totalAmountInstallmentDebits: number;
  };
}

export default Debits;
