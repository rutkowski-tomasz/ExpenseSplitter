import { ExpenseType } from './expense-type';
import { Trip } from './trip';
import { UserExtract } from './user-extract';
import { ExpensePart } from './expense-part';
import { Participant } from './participant';

export class Expense {

    id: number;
    name: string;

    expenseType: ExpenseType;
    createdAt: Date;
    updatedAt: Date;
    paidAt: Date;

    tripUid: string;
    trip: Trip;

    adderId: number;
    adder: UserExtract;

    payerId: number;
    payer: Participant;
    
    parts: ExpensePart[];
}
