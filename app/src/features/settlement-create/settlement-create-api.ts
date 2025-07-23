import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateSettlementRequest, CreateSettlementResponse } from './settlement-create-models';
import { apiCall } from '~/lib/api';

async function createSettlement(data: CreateSettlementRequest): Promise<CreateSettlementResponse> {
  const response = await apiCall('/api/v1/Settlements', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export function useCreateSettlementMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSettlement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlements'] });
    },
  });
} 