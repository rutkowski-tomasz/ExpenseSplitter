import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { ExpenseDetailsResponse, ExpenseDetailsWithNamesResponse, DeleteExpenseRequest } from './expense-details-models';
import { GetSettlementResponse } from '~/features/settlement-details/settlement-details-models';
import { apiCall } from '~/lib/api';

const fetchExpenseDetails = async (expenseId: string): Promise<ExpenseDetailsResponse> => {
  const response = await apiCall(`/api/v1/Expenses/${expenseId}`);
  return await response.json();
};

const fetchSettlement = async (settlementId: string): Promise<GetSettlementResponse> => {
  const response = await apiCall(`/api/v1/Settlements/${settlementId}`);
  return await response.json();
};

const fetchExpenseWithSettlement = async (expenseId: string): Promise<ExpenseDetailsWithNamesResponse> => {
  const expenseData = await fetchExpenseDetails(expenseId);
  const settlementData = await fetchSettlement(expenseData.settlementId);
  
  const payingParticipantName = settlementData.participants.find(p => p.id === expenseData.payingParticipantId)?.nickname || 'Unknown User';
  
  const allocationsWithNames = expenseData.allocations.map(allocation => ({
    ...allocation,
    participantName: settlementData.participants.find(p => p.id === allocation.participantId)?.nickname || 'Unknown User',
  }));

  return {
    ...expenseData,
    payingParticipantName,
    settlementName: settlementData.name,
    allocations: allocationsWithNames,
  };
};

const deleteExpense = async (request: DeleteExpenseRequest): Promise<void> => {
  await apiCall(`/api/v1/Expenses/${request.expenseId}`, {
    method: 'DELETE',
  });
};

export const useGetExpenseDetailsWithSettlementQuery = (
  expenseId: string,
  options?: Partial<UseQueryOptions<ExpenseDetailsWithNamesResponse>>
) => {
  return useQuery({
    queryKey: ['expense-details-with-settlement', expenseId],
    queryFn: () => fetchExpenseWithSettlement(expenseId),
    enabled: !!expenseId,
    ...options,
  });
};

export const useDeleteExpenseMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: (_, variables) => {
      queryClient.removeQueries({ queryKey: ['expense-details-with-settlement', variables.expenseId] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['settlement'] });
    },
  });
}; 