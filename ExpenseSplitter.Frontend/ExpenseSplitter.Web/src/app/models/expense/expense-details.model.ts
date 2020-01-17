import { ExpensePartModel } from './expense-part.model';
import { ExpenseTypeEnum } from 'src/app/models/expense/expense-type.enum';

export class ExpenseDetailsModel {
    id: number;
    name: string;
    type: ExpenseTypeEnum;
    paidAt: Date;
    payerId: number;
    value: number;
    myParticipantId: number;
    parts: ExpensePartModel[];
}