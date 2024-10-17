export interface TransferEvent {
  id: number;
  from?: string;
  to?: string;
  tokenId?: string;
  blockNumber?: string;
}

export interface LoanIssuedEvent {
  id: number;
  to?: string;
  tokenId?: string;
  principal?: string;
  totalRepaymentAmount?: string;
  issuanceDate?: string;
  loanTerm?: string;
  loanPurpose?: string;
  blockNumber?: string;
}

export interface PaymentRecordedEvent {
  id: number;
  tokenId?: string;
  paymentId?: string;
  paymentAmount?: string;
  paymentDate?: string;
}

export const LoanPurpose = {
  "0": "Buying a smartphone",
  "1": "Buying a motorcycle",
  "2": "Buying an ebike",
  "3": "Buying an ebike battery",
  "4": "Paying down debt",
  "5": "Investing in work tools",
  "6": "Starting a small business",
  "7": "Sending remittances",
  "8": "Paying for education",
  "9": "Paying for domestic emergencies",
};
