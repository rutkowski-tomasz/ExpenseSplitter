import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateSettlementRequest, CreateSettlementResponse, UpdateSettlementRequest, UpdateSettlementResponse } from './settlement-form-models';
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

async function updateSettlement(data: UpdateSettlementRequest): Promise<UpdateSettlementResponse> {
  await apiCall(`/api/v1/Settlements/${data.settlementId}`, {
    method: 'PUT',
    body: JSON.stringify(data.body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
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

export function useUpdateSettlementMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSettlement,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['settlement', variables.settlementId, 'details'] });
      queryClient.invalidateQueries({ queryKey: ['settlements'] });
    },
  });
} 