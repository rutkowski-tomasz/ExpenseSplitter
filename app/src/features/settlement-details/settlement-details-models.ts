export interface GetSettlementRequest {
  settlementId: string;
}

export interface GetSettlementResponse {
  id: string;
  name: string;
  inviteCode: string;
  totalCost: number;
  yourCost?: number;
  participants: GetSettlementResponseParticipant[];
}

export interface GetSettlementResponseParticipant {
  id: string;
  nickname: string;
} 