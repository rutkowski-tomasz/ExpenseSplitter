import { Component, OnInit } from '@angular/core';
import { ExpenseService } from 'src/app/services/expense-service/expense.service';
import { ActivatedRoute } from '@angular/router';
import { Expense } from 'src/app/data/expense';
import { ExpenseExtractModel } from 'src/app/models/expense/expense-extract-model';

@Component({
    templateUrl: './expenses.component.html',
    styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {

    public expenses: ExpenseExtractModel[];
    public uid: string;

    constructor(
        private expenseService: ExpenseService,
        private activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit() {

        this.activatedRoute.parent.params.subscribe(params => {

            this.uid = params.uid;

            this.expenseService.GetExpenses(this.uid).subscribe(data => {
                this.expenses = data;
            });
        });
    }
}