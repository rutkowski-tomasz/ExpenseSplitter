export interface ExpenseDetailsResponse {
  id: string;
  title: string;
  payingParticipantId: string;
  paymentDate: string;
  amount: number;
  settlementId: string;
  allocations: ExpenseAllocation[];
}

export interface ExpenseAllocation {
  id: string;
  participantId: string;
  amount: number;
}

export interface ExpenseDetailsWithNamesResponse {
  id: string;
  title: string;
  payingParticipantId: string;
  payingParticipantName: string;
  claimedParticipantId: string;
  paymentDate: string;
  amount: number;
  settlementId: string;
  settlementName: string;
  allocations: ExpenseAllocationWithName[];
}

export interface ExpenseAllocationWithName extends ExpenseAllocation {
  participantName: string;
}

export interface DeleteExpenseRequest {
  expenseId: string;
} 