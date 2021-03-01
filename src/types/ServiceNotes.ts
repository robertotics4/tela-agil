export interface OpenNote {
  type: string;
  typeDescription: string;
  codeGroup: string;
  codeGroupDescription: string;
  code: string;
  codeDescription: string;
  openingDate: Date;
  status: string;
  rejectionCode: string | null;
  rejectionCodeDescription: string | null;
}

export interface ClosedNote {
  type: string;
  typeDescription: string;
  codeGroup: string;
  codeGroupDescription: string;
  code: string;
  codeDescription: string;
  openingDate: Date;
  conclusionDate: Date;
}

interface ServiceNotes {
  openServiceNotes: OpenNote[];
  closedServiceNotes: ClosedNote[];
}

export default ServiceNotes;
