import { useQuery } from "@tanstack/react-query";
import { SettlementReimbursementResponse } from "./settlement-balances-models";
import { apiCall } from "~/lib/api";

async function getSettlementBalances(settlementId: string): Promise<SettlementReimbursementResponse> {
  const response = await apiCall(`/api/v1/Settlements/${settlementId}/reimbursement`);
  return await response.json();
}

export function useGetSettlementBalancesQuery(settlementId: string) {
  return useQuery({
    queryKey: ['settlement', settlementId, 'reimbursements'],
    queryFn: async () => {
      return await getSettlementBalances(settlementId);
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!settlementId,
  });
} 