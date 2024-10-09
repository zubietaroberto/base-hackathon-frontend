export interface TransferEvent {
  from?: string;
  to?: string;
  tokenId?: string;
  blockNumber?: string;
}

export interface CreditIssuedEvent {
  to?: string;
  tokenId?: string;
  principal?: string;
  totalRepaymentAmount?: string;
  issuanceDate?: string;
  creditTerm?: string;
  blockNumber?: string;
}

export interface PaymentRecordedEvent {
  tokenId?: string;
  paymentId?: string;
  paymentAmount?: string;
  paymentDate?: string;
}
