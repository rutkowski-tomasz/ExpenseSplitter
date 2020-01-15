import { ExpenseTypeEnum } from 'src/app/models/expense/expense-type.enum';

export class ExpenseListModel {
    id: number;
    name: string;
    type: ExpenseTypeEnum;
    paidAt: Date;
    payerName: string;
    isPaidByMe: boolean;
    value: number;
    iSpent: number;
}
