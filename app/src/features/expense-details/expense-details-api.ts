import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { ExpenseDetailsResponse, ExpenseDetailsWithNamesResponse, DeleteExpenseRequest } from './expense-details-models';
import { GetSettlementResponse } from '~/features/settlement-details/settlement-details-models';
import { apiCall } from '~/lib/api';

const getExpense = async (expenseId: string): Promise<ExpenseDetailsResponse> => {
  const response = await apiCall(`/api/v1/Expenses/${expenseId}`);
  return await response.json();
};

const getSettlement = async (settlementId: string): Promise<GetSettlementResponse> => {
  const response = await apiCall(`/api/v1/Settlements/${settlementId}`);
  return await response.json();
};

const getExpenseAndSettlement = async (expenseId: string, settlementId: string): Promise<ExpenseDetailsWithNamesResponse> => {
  const expensePromise = getExpense(expenseId);
  const settlementPromise = getSettlement(settlementId);
  
  const [expense, settlement] = await Promise.all([expensePromise, settlementPromise]);
  
  const payingParticipantName = settlement.participants.find(p => p.id === expense.payingParticipantId)?.nickname || 'Unknown User';
  const allocationsWithNames = expense.allocations.map(allocation => ({
    ...allocation,
    participantName: settlement.participants.find(p => p.id === allocation.participantId)?.nickname || 'Unknown User',
  }));

  return {
    ...expense,
    payingParticipantName,
    settlementName: settlement.name,
    allocations: allocationsWithNames,
  };
};

const deleteExpense = async (request: DeleteExpenseRequest): Promise<void> => {
  await apiCall(`/api/v1/Expenses/${request.expenseId}`, {
    method: 'DELETE',
  });
};

export const useGetExpenseAndSettlementQuery = (
  expenseId: string,
  settlementId: string,
  options?: Partial<UseQueryOptions<ExpenseDetailsWithNamesResponse>>
) => {
  return useQuery({
    queryKey: ['expense', expenseId, 'details'],
    queryFn: () => getExpenseAndSettlement(expenseId, settlementId),
    enabled: !!expenseId,
    ...options,
  });
};

export const useDeleteExpenseMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: (_, variables) => {
      queryClient.removeQueries({ queryKey: ['expense', variables.expenseId, 'details'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['settlement'] });
    },
  });
}; 