import { ExpenseTypeEnum } from 'src/app/data/expense-type';
import { ExpensePartModel } from './expense-part-model';

export class CreateExpenseModel {
    name: string;
    type: ExpenseTypeEnum;
    paidAt: Date;
    payerId: number;

    parts: ExpensePartModel[];
}