import { Injectable } from '@angular/core';
import { CallService } from '../call-service/call.service';
import { Observable } from 'rxjs';
import { BalanceResponseModel } from 'src/app/models/balance/balance-response-model';

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
}
