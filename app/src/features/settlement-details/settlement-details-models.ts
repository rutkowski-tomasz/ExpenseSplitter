export interface GetSettlementRequest {
  settlementId: string;
}

export interface GetSettlementResponse {
  id: string;
  name: string;
  inviteCode: string;
  totalCost: number;
  yourCost?: number;
  claimedParticipantId?: string;
  creatorUserId: string;
  participants: GetSettlementResponseParticipant[];
}

export interface GetSettlementResponseParticipant {
  id: string;
  nickname: string;
} 