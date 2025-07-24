import { z } from 'zod';

export const joinSettlementFormSchema = z.object({
  inviteCode: z.string()
    .min(1, 'Please enter an invite code')
    .trim()
    .transform((val) => {
      if (val.includes('inviteCode=')) {
        try {
          const url = new URL(val);
          return url.searchParams.get('inviteCode') || val;
        } catch {
          const match = val.match(/inviteCode=([^&]+)/);
          return match ? match[1] : val;
        }
      }
      return val;
    }),
});

export type JoinSettlementFormData = z.infer<typeof joinSettlementFormSchema>;

export type JoinSettlementRequestBody = {
  inviteCode: string;
};

export type JoinSettlementRequest = {
  body: JoinSettlementRequestBody;
}; 