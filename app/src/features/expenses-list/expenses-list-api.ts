import { useQuery } from '@tanstack/react-query';
import { GetExpensesForSettlementResponse } from './expenses-list-models';
import { apiCall } from '~/lib/api';

const fetchExpensesForSettlement = async (settlementId: string): Promise<GetExpensesForSettlementResponse> => {
  const response = await apiCall(`/api/v1/Settlements/${settlementId}/expenses`);
  return await response.json();
};

export const useGetExpensesForSettlementQuery = (settlementId: string) => {
  return useQuery({
    queryKey: ['expenses', settlementId],
    queryFn: () => fetchExpensesForSettlement(settlementId),
    enabled: !!settlementId,
  });
}; 