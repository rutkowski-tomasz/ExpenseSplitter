import { z } from 'zod';

export const settlementCreateSchema = z.object({
  name: z.string().min(1, 'Please enter a settlement name').trim(),
  participants: z.array(z.string())
    .min(1, 'Please add at least one participant')
    .refine(
      (participants) => participants.filter(p => p.trim()).length > 0,
      'Please add at least one participant'
    ),
});

export type CreateSettlementRequest = z.infer<typeof settlementCreateSchema>;
export type SettlementCreateFormData = CreateSettlementRequest;

export type CreateSettlementResponse = string;