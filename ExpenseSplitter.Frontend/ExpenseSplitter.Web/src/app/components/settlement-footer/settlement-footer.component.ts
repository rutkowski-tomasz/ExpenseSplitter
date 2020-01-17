import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BalanceService } from 'src/app/services/balance-service/balance.service';
import { BalanceSimpleModel } from 'src/app/models/balance/balance-simple.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'es-settlement-footer',
    templateUrl: './settlement-footer.component.html',
    styleUrls: ['./settlement-footer.component.scss']
})
export class SettlementFooterComponent implements OnInit, OnDestroy {

    @Input() uid: string;

    public shortBalance: BalanceSimpleModel;

    private isNotDestroyed = new Subject();

    constructor(
        private balanceService: BalanceService,
    ) { }

    public ngOnInit() {

        this.shortBalance = new BalanceSimpleModel();
        this.shortBalance.myCost = 0;
        this.shortBalance.totalCost = 0;

        this.balanceService.GetShortBalance(this.uid)
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe(shortBalance => {
                this.shortBalance = shortBalance;
            });
    }

    public ngOnDestroy(): void {
        this.isNotDestroyed.next();
        this.isNotDestroyed.complete();
    }
}
