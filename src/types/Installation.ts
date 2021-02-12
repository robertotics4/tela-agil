export interface TechnicalData {
  class: string;
  subclass: string;
  tariff: string;
  tensionGroup: string;
  geographicCoordinates: {
    latitude: string;
    longitude: string;
  };
  paymentType: string;
  phase: number;
  locality: string;
  goodPayer: boolean;
}

interface Installation {
  status: string;
  cutInProgress: boolean;
  turnOffInProgress: boolean;
  individualPowerOutage: boolean;
  collectivePowerOutage: boolean;
  scheduledShutdown: boolean;
  powerPhaseOutage: boolean;
  powerOutageTechnicalEvaluation: boolean;
  technicalData: TechnicalData;
}

export default Installation;
