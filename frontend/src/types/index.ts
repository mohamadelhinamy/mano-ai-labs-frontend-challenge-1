export interface RowData {
  claimId: string;
  subscriberId: string;
  memberSequence: number;
  claimStatus: 'Payable' | 'Denied' | 'Partial Deny';
  billed: number;
  allowed: number;
  paid: number;
  paymentStatusDate: string;
  serviceDate: string;
  receivedDate: string;
  entryDate: string;
  processedDate: string;
  paidDate: string;
  paymentStatus: string;
  groupName: string;
  groupId: string;
  divisionName: string;
  divisionId: string;
  plan: string;
  planId: string;
  placeOfService: string;
  claimType: 'Professional' | 'Institutional';
  procedureCode: string;
  memberGender: 'Male' | 'Female';
  providerId: string;
  providerName: string;
}
