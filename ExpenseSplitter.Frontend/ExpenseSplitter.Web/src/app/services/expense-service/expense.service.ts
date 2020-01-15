import { Injectable } from '@angular/core';
import { CallService } from '../call-service/call.service';
import { Observable } from 'rxjs';
import { ExpenseListModel } from 'src/app/models/expense/expense-list.model';
import { ExpenseUpdateModel } from 'src/app/models/expense/expense-update.model';
import { ExpenseDetailsModel } from 'src/app/models/expense/expense-details.model';

@Injectable({
    providedIn: 'root'
})
export class ExpenseService {
    private servicePrefix = 'trips';

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
        return this.callService.post(`${this.servicePrefix}/${uid}/expenses`, model);
    }

    public UpdateExpense(uid: string, model: ExpenseUpdateModel): Observable<boolean> {
        return this.callService.put(`${this.servicePrefix}/${uid}/expenses`, model);
    }

    public DeleteExpense(uid: string, id: number): Observable<boolean> {
        return this.callService.delete(`${this.servicePrefix}/${uid}/expenses/${id}`);
    }
}
