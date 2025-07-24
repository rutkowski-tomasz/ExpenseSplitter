import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GetSettlementResponse } from "./claim-participant-models";
import { apiCall } from "~/lib/api";

async function getSettlement(settlementId: string): Promise<GetSettlementResponse> {
  const response = await apiCall(`/api/v1/Settlements/${settlementId}`);
  const data = await response.json();
  return {
    id: data.id,
    name: data.name,
    totalCost: data.totalCost,
    participants: data.participants
  };
}

async function claimParticipant(settlementId: string, participantId: string): Promise<void> {
  await apiCall(`/api/v1/Settlements/${settlementId}/participants/${participantId}/claim`, {
    method: 'PATCH',
  });
}

export function useGetSettlementQuery(settlementId: string) {
  return useQuery({
    queryKey: ['settlement', settlementId, 'claim-details'],
    queryFn: async () => {
      return await getSettlement(settlementId);
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!settlementId,
  });
}

export function useClaimParticipantMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ settlementId, participantId }: { settlementId: string; participantId: string }) =>
      claimParticipant(settlementId, participantId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['settlement', variables.settlementId, 'details'] });
      queryClient.invalidateQueries({ queryKey: ['settlement', variables.settlementId, 'claim-details'] });
    },
  });
} 