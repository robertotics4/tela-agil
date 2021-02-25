export interface ServiceNote {
  type: string;
  description: string;
  codeGroup: string;
  codeGroupDescription: string;
  code: string;
  codeDescription: string;
  openingDate: Date;
  conclusionDate: Date;
}

interface ServiceNotes {
  openServiceNotes: ServiceNote[];
  closedServiceNotes: ServiceNote[];
}

export default ServiceNotes;
