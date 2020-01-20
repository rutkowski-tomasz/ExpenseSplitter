import { Injectable } from '@angular/core';
import { CallService } from '../../shared/services/call-service/call.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { ExpenseListModel } from 'src/app/models/expense/expense-list.model';
import { ExpenseUpdateModel } from 'src/app/models/expense/expense-update.model';
import { ExpenseDetailsModel } from 'src/app/models/expense/expense-details.model';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ExpenseService {
    private servicePrefix = 'trips';

    public lastUpdatedExpenseId = new BehaviorSubject<number>(null);

    constructor(
        private callService: CallService,
    ) { }

    public GetExpenses(uid: string): Observable<ExpenseListModel[]> {
        return this.callService.get(`${this.servicePrefix}/${uid}/expenses`);
    }

    public GetExpense(uid: string, id: number): Observable<ExpenseDetailsModel> {
        return this.callService.get(`${this.servicePrefix}/${uid}/expenses/${id}`);
    }

    public CreateExpense(uid: string, model: ExpenseUpdateModel): Observable<number> {
        return this.callService
            .post<number>(`${this.servicePrefix}/${uid}/expenses`, model)
            .pipe(
                tap(x => this.lastUpdatedExpenseId.next(x))
            );
    }

    public UpdateExpense(uid: string, model: ExpenseUpdateModel): Observable<boolean> {
        return this.callService
            .put<boolean>(`${this.servicePrefix}/${uid}/expenses`, model)
            .pipe(
                tap(_ => this.lastUpdatedExpenseId.next(model.id))
            );
    }

    public DeleteExpense(uid: string, id: number): Observable<boolean> {
        return this.callService.delete(`${this.servicePrefix}/${uid}/expenses/${id}`);
    }
}
