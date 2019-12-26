import { Expense } from './expense';
import { Participant } from './participant';

export class ExpensePart
{
    id: number;
    value: number;

    expenseId: number;
    expense: Expense;
    
    participants: Participant[];
}
