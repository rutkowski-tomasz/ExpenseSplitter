import { Injectable } from '@angular/core';
import { CallService } from '../call-service/call.service';
import { Observable } from 'rxjs';
import { BalanceModel } from 'src/app/models/balance/balance.model';
import { BalanceSimpleModel } from 'src/app/models/balance/balance-simple.model';

@Injectable({
    providedIn: 'root'
})
export class BalanceService {
    private servicePrefix = (uid: string) => `trips/${uid}/balance`;

    constructor(
        private callService: CallService,
    ) { }

    public GetBalance(uid: string): Observable<BalanceModel> {
        return this.callService.get<BalanceModel>(`${this.servicePrefix(uid)}`);
    }

    // public markSettlementAsPaid(uid: string, value: number, fromParticipantId: number, toParticipantId: number): Observable<Expense> {
    //     return this.callService.postForm(`${this.servicePrefix(uid)}/markSettlementAsPaid`, {
    //         value,
    //         fromParticipantId,
    //         toParticipantId,
    //     });
    // }

    public GetShortBalance(uid: string): Observable<BalanceSimpleModel> {
        return this.callService.get<BalanceSimpleModel>(`${this.servicePrefix(uid)}/short`);
    }
}
