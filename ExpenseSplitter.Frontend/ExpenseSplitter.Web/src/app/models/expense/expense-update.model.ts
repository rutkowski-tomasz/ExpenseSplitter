import { ExpenseTypeEnum } from 'src/app/models/expense/expense-type.enum';
import { ExpensePartModel } from './expense-part.model';

export class ExpenseUpdateModel {
    id?: number;
    name: string;
    type: ExpenseTypeEnum;
    paidAt: Date;
    payerId: number;

    parts: ExpensePartModel[];
}