interface Contract {
  installationNumber: string;
  class: string;
  installationStatus: string;
  contractStatus: string;
  lowIncome: boolean;
  irregularConsumption: boolean;
  scheduledShutdown: boolean;
  averageConsumption: number;
}

export default Contract;
