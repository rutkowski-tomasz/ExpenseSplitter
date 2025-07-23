export interface GetExpensesForSettlementResponse {
  expenses: GetExpensesForSettlementResponseExpense[];
}

export interface GetExpensesForSettlementResponseExpense {
  id: string;
  title: string;
  amount: number;
  payingParticipantId: string;
  paymentDate: string;
}

export interface ExpenseListItem extends GetExpensesForSettlementResponseExpense {
  payingParticipantName?: string;
} 