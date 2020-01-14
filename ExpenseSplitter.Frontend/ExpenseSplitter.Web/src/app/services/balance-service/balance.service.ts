import { Injectable } from '@angular/core';
import { CallService } from '../call-service/call.service';
import { Observable } from 'rxjs';
import { BalanceResponseModel } from 'src/app/models/balance/balance-response-model';
import { Expense } from 'src/app/data/expense';
import { ShortBalanceResponse } from 'src/app/models/balance/short-balance-response-model';

@Injectable({
    providedIn: 'root'
})
export class BalanceService {
    private servicePrefix = (uid: string) => `trips/${uid}/balance`;

    constructor(
        private callService: CallService,
    ) { }

    public GetBalance(uid: string): Observable<BalanceResponseModel> {
        return this.callService.get<BalanceResponseModel>(`${this.servicePrefix(uid)}`);
    }

    public markSettlementAsPaid(uid: string, value: number, fromParticipantId: number, toParticipantId: number): Observable<Expense> {
        return this.callService.postForm(`${this.servicePrefix(uid)}/markSettlementAsPaid`, {
            value,
            fromParticipantId,
            toParticipantId,
        });
    }

    public GetShortBalance(uid: string): Observable<ShortBalanceResponse> {
        return this.callService.get<ShortBalanceResponse>(`${this.servicePrefix(uid)}/short`);
    }
}
