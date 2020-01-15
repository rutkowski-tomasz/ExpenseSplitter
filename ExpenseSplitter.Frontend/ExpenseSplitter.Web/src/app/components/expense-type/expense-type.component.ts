import { Component, OnInit, Input } from '@angular/core';
import { ExpenseTypeEnum } from 'src/app/models/expense/expense-type.enum';

@Component({
    selector: 'es-expense-type',
    template: `
    <ng-container [ngSwitch]="type">
        <ng-container *ngSwitchCase="ExpenseTypeEnum.Expense">
            Wydatek
        </ng-container>
        <ng-container *ngSwitchCase="ExpenseTypeEnum.Income">
            Wpływ
        </ng-container>
        <ng-container *ngSwitchCase="ExpenseTypeEnum.Transfer">
            Przelew
        </ng-container>
    </ng-container>
    `,
    styleUrls: []
})
export class ExpenseTypeComponent implements OnInit {

    @Input() type: ExpenseTypeEnum;
    public ExpenseTypeEnum = ExpenseTypeEnum;

    constructor() { }

    ngOnInit() {
    }
}
