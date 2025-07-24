import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Result, ok, err } from 'neverthrow';
import { JoinSettlementRequest } from './join-settlement-models';
import { apiCall } from '~/lib/api';

async function joinSettlement(data: JoinSettlementRequest): Promise<Result<string, string>> {
  try {
    const response = await apiCall('/api/v1/Settlements/join', {
      method: 'POST',
      body: JSON.stringify(data.body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      const message = await response.json();
      return err(message || 'Invite code not found or expired');
    }

    if (response.status === 400) {
      const message = await response.json();
      return err(message || 'User already joined this settlement');
    }

    if (!response.ok) {
      const message = await response.json();
      return err(message || 'Failed to join settlement');
    }

    const settlementId = await response.json();
    return ok(settlementId);
  } catch (e) {
    return err('Network error occurred');
  }
}

export function useJoinSettlementMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinSettlement,
    onSuccess: (result) => {
      if (result.isOk()) {
        queryClient.invalidateQueries({ queryKey: ['settlements'] });
        queryClient.invalidateQueries({ queryKey: ['settlement', result.value, 'details'] });
      }
    },
  });
} 