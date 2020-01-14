import { Participant } from './participant';
import { ExpensePart } from './expense-part';

export class ExpensePartParticipant {
    id: number;

    expensePartId: number;
    expensePart: ExpensePart;

    participantId: number;
    participant: Participant;
}
