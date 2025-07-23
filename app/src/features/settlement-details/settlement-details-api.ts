import { useQuery } from "@tanstack/react-query";
import { GetSettlementResponse } from "./settlement-details-models";
import { apiCall } from "~/lib/api";

async function getSettlement(settlementId: string): Promise<GetSettlementResponse> {
  const response = await apiCall(`/api/v1/Settlements/${settlementId}`);
  return await response.json();
}

export function useGetSettlementQuery(settlementId: string) {
  return useQuery({
    queryKey: ['settlement', settlementId],
    queryFn: async () => {
      return await getSettlement(settlementId);
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!settlementId,
  });
} 