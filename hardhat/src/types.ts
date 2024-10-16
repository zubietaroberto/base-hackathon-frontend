export interface TransferEvent {
  from?: string;
  to?: string;
  tokenId?: string;
  blockNumber?: string;
}

export interface LoanIssued {
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
  tokenId?: string;
  paymentId?: string;
  paymentAmount?: string;
  paymentDate?: string;
}
