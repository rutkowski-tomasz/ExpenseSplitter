import { ExpenseTypeEnum } from 'src/app/data/expense-type';
import { ExpensePartModel } from './expense-part-model';

export class UpdateExpenseModel {
    id?: number;
    name: string;
    type: ExpenseTypeEnum;
    paidAt: Date;
    payerId: number;

    parts: ExpensePartModel[];
}