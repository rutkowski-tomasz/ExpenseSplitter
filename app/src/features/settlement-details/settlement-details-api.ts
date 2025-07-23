import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { GetSettlementResponse } from "./settlement-details-models";
import { apiCall } from "~/lib/api";

async function getSettlement(settlementId: string): Promise<GetSettlementResponse> {
  const response = await apiCall(`/api/v1/Settlements/${settlementId}`);
  return await response.json();
}

async function deleteSettlement(settlementId: string): Promise<void> {
  await apiCall(`/api/v1/Settlements/${settlementId}`, {
    method: 'DELETE',
  });
}

export function useGetSettlementQuery(
  settlementId: string, 
  options?: Partial<UseQueryOptions<GetSettlementResponse>>
) {
  return useQuery({
    queryKey: ['settlement', settlementId],
    queryFn: async () => {
      return await getSettlement(settlementId);
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!settlementId,
    ...options,
  });
}

export function useDeleteSettlementMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSettlement,
    onSuccess: (_, settlementId) => {
      queryClient.removeQueries({ queryKey: ['settlement', settlementId] });
      queryClient.invalidateQueries({ queryKey: ['settlements'] });
    },
  });
} 