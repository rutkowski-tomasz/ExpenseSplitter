export interface GetAllSettlementsResponse {
  settlements: GetAllSettlementsResponseSettlement[];
}

export interface GetAllSettlementsResponseSettlement {
  id: string;
  name: string;
  participantCount: number;
  totalExpenses: number;
  lastActivity: string;
  userBalance: number;
}
