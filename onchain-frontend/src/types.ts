export interface TransferEvent {
  id: number;
  from?: string;
  to?: string;
  tokenId?: string;
  blockNumber?: string;
}

export interface CreditIssuedEvent {
  id: number;
  to?: string;
  tokenId?: string;
  principal?: string;
  totalRepaymentAmount?: string;
  issuanceDate?: string;
  creditTerm?: string;
  blockNumber?: string;
}

export interface PaymentRecordedEvent {
  id: number;
  tokenId?: string;
  paymentId?: string;
  paymentAmount?: string;
  paymentDate?: string;
}
