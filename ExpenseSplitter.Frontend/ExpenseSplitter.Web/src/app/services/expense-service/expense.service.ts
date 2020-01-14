import { Injectable } from '@angular/core';
import { CallService } from '../call-service/call.service';
import { Observable } from 'rxjs';
import { Expense } from 'src/app/data/expense';
import { ExpenseExtractModel } from 'src/app/models/expense/expense-extract-model';
import { UpdateExpenseModel } from 'src/app/models/expense/update-expense-model';

@Injectable({
    providedIn: 'root'
})
export class ExpenseService {
    private servicePrefix = 'trips';

    constructor(
        private callService: CallService,
    ) { }

    public GetExpenses(uid: string): Observable<ExpenseExtractModel[]> {
        return this.callService.get<ExpenseExtractModel[]>(`${this.servicePrefix}/${uid}/expenses`);
    }

    public GetExpense(uid: string, id: number): Observable<Expense> {
        return this.callService.get<Expense>(`${this.servicePrefix}/${uid}/expenses/${id}`);
    }

    public CreateExpense(uid: string, model: UpdateExpenseModel): Observable<Expense> {
        return this.callService.post(`${this.servicePrefix}/${uid}/expenses`, model);
    }

    public UpdateExpense(uid: string, model: UpdateExpenseModel): Observable<Expense> {
        return this.callService.put(`${this.servicePrefix}/${uid}/expenses`, model);
    }

    public DeleteExpense(uid: string, id: number) {
        return this.callService.delete(`${this.servicePrefix}/${uid}/expenses/${id}`);
    }
}
