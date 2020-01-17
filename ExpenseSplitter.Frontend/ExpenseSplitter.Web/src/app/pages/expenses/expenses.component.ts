import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExpenseService } from 'src/app/services/expense-service/expense.service';
import { ActivatedRoute } from '@angular/router';
import { ExpenseListModel } from 'src/app/models/expense/expense-list.model';
import { ExpenseTypeEnum } from 'src/app/models/expense/expense-type.enum';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
    templateUrl: './expenses.component.html',
    styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit, OnDestroy {

    public expenses: ExpenseListModel[];
    public ExpenseTypeEnum = ExpenseTypeEnum;
    public uid: string;
    public lastUpdatedExpenseId: number;

    private isNotDestroyed = new Subject();

    constructor(
        private expenseService: ExpenseService,
        private activatedRoute: ActivatedRoute,
    ) { }

    public ngOnInit() {

        this.activatedRoute.parent.params
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe(params => {

                this.uid = params.uid;

                this.expenseService.GetExpenses(this.uid)
                    .pipe(takeUntil(this.isNotDestroyed))
                    .subscribe(data => {
                        this.expenses = data;
                    });
            });

        this.expenseService.lastUpdatedExpenseId
            .pipe(
                takeUntil(this.isNotDestroyed),
                filter(x => x !== null)
            )
            .subscribe(id => {
                this.lastUpdatedExpenseId = id;
                this.expenseService.lastUpdatedExpenseId.next(null);
            });
    }

    public ngOnDestroy(): void {
        this.isNotDestroyed.next();
        this.isNotDestroyed.complete();
    }
}