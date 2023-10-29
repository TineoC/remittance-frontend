export interface Subsidy {
  id: number;
  name: string;
  code: string;
  message: string;
  validTime: number;
  active: boolean;
}

export interface Sender {
  id: number;
  code: string;
  name: string;
  subsidies: Subsidy[];
  active: boolean;
  debitAccount: string;
}
