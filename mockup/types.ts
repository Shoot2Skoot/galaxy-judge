export interface CaseData {
  id: string;
  status: string;
  accused: {
    name: string;
    age: number;
    role: string;
  };
  charges: {
    crime: string;
    severity: string;
    details?: string;
  };
  evidence: string[]; // Placeholder for evidence tab
  verdict: string | null;
}

export enum Tab {
  CHARGES = 'CHARGES',
  EVIDENCE = 'EVIDENCE',
  VERDICT = 'VERDICT'
}