import { z } from 'zod';

export const settlementFormSchema = z.object({
  name: z.string().min(1, 'Please enter a settlement name').trim(),
  participants: z.array(z.string())
    .min(1, 'Please add at least one participant')
    .refine(
      (participants) => participants.filter(p => p.trim()).length > 0,
      'Please add at least one participant'
    ),
});

export type SettlementFormData = z.infer<typeof settlementFormSchema>;

export type CreateSettlementRequest = {
  name: string;
  participantNames: string[];
};

export type UpdateSettlementRequestParticipant = {
  id: string | null;
  nickname: string;
};

export type UpdateSettlementRequestBody = {
  name: string;
  participants: UpdateSettlementRequestParticipant[];
};

export type UpdateSettlementRequest = {
  settlementId: string;
  body: UpdateSettlementRequestBody;
};

export type CreateSettlementResponse = string;
export type UpdateSettlementResponse = void; 