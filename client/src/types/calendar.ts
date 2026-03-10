export interface Task {
  id: string;
  text: string;
  labels: string[];
  date: string; // YYYY-MM-DD
  order: number;
}

export interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
}

export type LabelColor = 'green' | 'yellow' | 'blue' | 'orange' | 'purple' | 'cyan';
