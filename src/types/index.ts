export type Job = {
  jobsId: number | null;
  number: string;
  type: string;
  name: string;
  address: string;
  contractor: string;
  contact: string;
  status: string;
};

export type Employee = {
  employeesId: number;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  status: string;
  title: string;
};

export type ClReport = {
  equipmentsGoogleChecklistsId: number | null;
  jobsId: number;
  userName: string;
  date: string;
  checklists: Checklist[];
};

export type Checklist = {
  temporalId: string;
  googleChecklistsId: number | null;
  equipmentName: string;
  equipmentsId: number | null;
  employeesId: number | null;
  odometer: string;
  selectedOptions: SelectedOption[];
  comment: string;
  otherType: string;
};

export type SelectedOption = {
  name: string;
  selectedValue: string;
};

export type Item = {
  id: number;
  img: string;
  name: string;
  choices: string[];
  default: string;
};

export type Equipment = {
  equipmentsId: number;
  family: string;
  number: string;
  name: string;
  manufacturing: string;
  model: string;
  year: string;
  purchaseDate: string;
  status: string;
  condition: string;
  serialNumber: string;
  hour: string;
};

export type QrChecklist = {
  checklistsId: number;
  equipmentsId: number;
  employeesId: number;
  jobsId: number;
  type: string;
  date: string;
  odometer: string;
  oil: string;
  hydraulic: string;
  filter: string;
  radiator: string;
  track: string;
  attachment: string;
  leaking: string;
  diesel: string;
  clean: string;
  comment: string;
  status: string;
};

export type User = {
  id: number;
  fullName: string;
  email: string;
};

export type apiClReport = {
  equipmentsGoogleChecklistsId: number | null;
  jobsId: number;
  userName: string;
  date: string;
  checklists: apiChecklist[];
};

export type apiChecklist = {
  googleChecklistsId: number;
  equipmentNumber: string;
  equipmentName: string;
  operator: string;
  odometer: string;
  oil: string;
  hydraulic: string;
  filter: string;
  radiator: string;
  track: string;
  attachment: string;
  leaking: string;
  diesel: string;
  clean: string;
  comment: string;
  otherType: string;
};
