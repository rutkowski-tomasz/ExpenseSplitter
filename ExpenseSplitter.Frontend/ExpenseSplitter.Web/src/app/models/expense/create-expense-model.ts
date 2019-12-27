import { ExpenseTypeEnum } from 'src/app/data/expense-type';
import { ExpensePart } from 'src/app/data/expense-part';

export class CreateExpenseModel {
    name: string;
    type: ExpenseTypeEnum;
    paidAt: Date;
    payerId: number;

    parts: ExpensePart[];
}