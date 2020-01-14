import { Expense } from './expense';
import { ExpensePartParticipant } from './expense-part-participant';

export class ExpensePart
{
    id: number;
    value: number;

    expenseId: number;
    expense: Expense;

    partParticipants: ExpensePartParticipant[];
}
