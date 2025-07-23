import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateExpenseRequest, CreateExpenseResponse, UpdateExpenseRequest, UpdateExpenseResponse } from './expense-form-models';
import { apiCall } from '~/lib/api';

async function createExpense(data: CreateExpenseRequest): Promise<CreateExpenseResponse> {
  const response = await apiCall('/api/v1/Expenses', {
    method: 'POST',
    body: JSON.stringify(data.body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

async function updateExpense(data: UpdateExpenseRequest): Promise<UpdateExpenseResponse> {
  await apiCall(`/api/v1/Expenses/${data.expenseId}`, {
    method: 'PUT',
    body: JSON.stringify(data.body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function useCreateExpenseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExpense,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.body.settlementId] });
      queryClient.invalidateQueries({ queryKey: ['settlement', variables.body.settlementId] });
    },
  });
}

export function useUpdateExpenseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateExpense,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expense', variables.expenseId] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
} 