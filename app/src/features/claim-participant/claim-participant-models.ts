export interface ClaimParticipantRequest {
  settlementId: string;
  participantId: string;
}

export interface GetSettlementRequest {
  settlementId: string;
}

export interface GetSettlementResponse {
  id: string;
  name: string;
  totalCost: number;
  participants: GetSettlementResponseParticipant[];
}

export interface GetSettlementResponseParticipant {
  id: string;
  nickname: string;
} 