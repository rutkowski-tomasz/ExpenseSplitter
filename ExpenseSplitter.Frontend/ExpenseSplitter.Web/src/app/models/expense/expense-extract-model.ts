import { ExpenseTypeEnum } from 'src/app/data/expense-type';

export class ExpenseExtractModel {
    id: number;
    name: string;
    type: ExpenseTypeEnum;
    paidAt: Date;
    payerName: string;
    isPaidByMe: boolean;
    value: number;
}
