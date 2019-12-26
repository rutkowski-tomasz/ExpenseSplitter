import { Expense } from './expense';
import { Participant } from './participant';

export class ExpensePartParticipant {
    id: number;

    expenseId: number;
    expense: Expense;

    participantId: number;
    participant: Participant;
}
