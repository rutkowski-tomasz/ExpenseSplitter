import { Component, OnInit, Input } from '@angular/core';
import { BalanceService } from 'src/app/services/balance-service/balance.service';
import { BalanceSimpleModel } from 'src/app/models/balance/balance-simple.model';

@Component({
    selector: 'es-settlement-footer',
    templateUrl: './settlement-footer.component.html',
    styleUrls: ['./settlement-footer.component.scss']
})
export class SettlementFooterComponent implements OnInit {

    @Input() uid: string;

    public shortBalance: BalanceSimpleModel;

    constructor(
        private balanceService: BalanceService,
    ) { }

    ngOnInit() {

        this.shortBalance = new BalanceSimpleModel();
        this.shortBalance.myCost = 0;
        this.shortBalance.totalCost = 0;

        this.balanceService.GetShortBalance(this.uid).subscribe(shortBalance => {
            this.shortBalance = shortBalance;
        });
    }
}
