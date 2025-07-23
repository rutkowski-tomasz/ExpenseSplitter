export interface CalculateReimbursementRequest {
  settlementId: string;
}

export interface SettlementReimbursementResponse {
  balances: SettlementReimbursementResponseBalance[];
  suggestedReimbursements: SettlementReimbursementResponseSuggestedReimbursement[];
}

export interface SettlementReimbursementResponseBalance {
  participantId: string;
  value: number;
}

export interface SettlementReimbursementResponseSuggestedReimbursement {
  fromParticipantId: string;
  toParticipantId: string;
  value: number;
} 