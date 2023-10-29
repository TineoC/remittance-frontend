export interface SubsidyDetail {
    id: number;
    code: string;
    status: string;
    beneficiary: string;
    identificationId: string;
    subsidy: string;
    amount: number;
    currency: string;
    officeId?: string;
    paymentDate?: string;
}