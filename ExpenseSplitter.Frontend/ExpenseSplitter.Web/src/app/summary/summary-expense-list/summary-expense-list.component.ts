import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExpenseService } from 'src/app/services/expense-service/expense.service';
import { ActivatedRoute } from '@angular/router';
import { ExpenseListModel } from 'src/app/models/expense/expense-list.model';
import { ExpenseTypeEnum } from 'src/app/models/expense/expense-type.enum';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { UserService } from 'src/app/services/user-service/user.service';
import { AppConfig } from 'src/app/shared/app.config';

@Component({
    templateUrl: './summary-expense-list.component.html',
    styleUrls: ['./summary-expense-list.component.scss']
})
export class SummaryExpenseListComponent implements OnInit, OnDestroy {

    public loadedExpenses: ExpenseListModel[];
    public expenses: ExpenseListModel[];
    public ExpenseTypeEnum = ExpenseTypeEnum;
    public uid: string;
    public lastUpdatedExpenseId: number;
    public detailedCalculations: boolean;
    public onlyMyExpenses: boolean;

    private isNotDestroyed = new Subject();

    constructor(
        private expenseService: ExpenseService,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private appConfig: AppConfig,
    ) { }

    public ngOnInit() {

        this.userService.preferences
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe(preferences => {
                this.detailedCalculations = preferences[this.appConfig.detailedCalculations];
                this.onlyMyExpenses = preferences[this.appConfig.onlyMyExpenses];

                this.filterExpenses();
            });

        this.activatedRoute.parent.params
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe(params => {

                this.uid = params.uid;

                this.expenseService.GetExpenses(this.uid)
                    .pipe(takeUntil(this.isNotDestroyed))
                    .subscribe(data => {
                        this.loadedExpenses = data;
                        this.filterExpenses();
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

    private filterExpenses() {

        if (!this.loadedExpenses) {
            return;
        }

        if (!this.onlyMyExpenses) {
            this.expenses = this.loadedExpenses;
            return;
        }

        this.expenses = this.loadedExpenses.filter(x => x.isPaidByMe || x.iSpent !== 0);
    }
}