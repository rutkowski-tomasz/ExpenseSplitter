import { ExpensePartModel } from './expense-part-model';
import { ExpenseTypeEnum } from 'src/app/data/expense-type';

export class ExpenseDetailsExtactModel {
    id: number;
    name: string;
    type: ExpenseTypeEnum;
    paidAt: Date;
    payerId: number;
    value: number;
    parts: ExpensePartModel[];
}