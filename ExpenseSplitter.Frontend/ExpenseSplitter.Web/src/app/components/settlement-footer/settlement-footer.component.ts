import { Component, OnInit, Input } from '@angular/core';
import { BalanceService } from 'src/app/services/balance-service/balance.service';
import { ShortBalanceResponse } from 'src/app/models/balance/short-balance-response-model';

@Component({
    selector: 'es-settlement-footer',
    templateUrl: './settlement-footer.component.html',
    styleUrls: ['./settlement-footer.component.scss']
})
export class SettlementFooterComponent implements OnInit {

    @Input() uid: string;

    public shortBalance: ShortBalanceResponse;

    constructor(
        private balanceService: BalanceService,
    ) { }

    ngOnInit() {
        this.balanceService.GetShortBalance(this.uid).subscribe(shortBalance => {
            this.shortBalance = shortBalance;
        });
    }
}
