import { z } from 'zod';

export const expenseFormSchema = z.object({
  name: z.string().min(1, 'Please enter an expense name').trim(),
  paymentDate: z.string().min(1, 'Please select a payment date'),
  payingParticipantId: z.string().min(1, 'Please select who paid'),
  allocations: z.array(z.object({
    participantId: z.string(),
    value: z.number().min(0.01, 'Amount must be greater than 0'),
  })).min(1, 'Please add at least one allocation'),
}).refine(
  (data) => {
    const totalAllocation = data.allocations.reduce((sum, allocation) => sum + allocation.value, 0);
    return totalAllocation > 0;
  },
  { message: 'Total allocation must be greater than 0', path: ['allocations'] }
);

export type ExpenseFormData = z.infer<typeof expenseFormSchema>;

export type CreateExpenseRequestAllocation = {
  participantId: string;
  value: number;
};

export type CreateExpenseRequestBody = {
  name: string;
  paymentDate: string;
  settlementId: string;
  payingParticipantId: string;
  allocations: CreateExpenseRequestAllocation[];
};

export type CreateExpenseRequest = {
  body: CreateExpenseRequestBody;
};

export type UpdateExpenseRequestAllocation = {
  id?: string;
  participantId: string;
  value: number;
};

export type UpdateExpenseRequestBody = {
  title: string;
  paymentDate: string;
  payingParticipantId: string;
  allocations: UpdateExpenseRequestAllocation[];
};

export type UpdateExpenseRequest = {
  expenseId: string;
  body: UpdateExpenseRequestBody;
};

export type CreateExpenseResponse = string;
export type UpdateExpenseResponse = void; 