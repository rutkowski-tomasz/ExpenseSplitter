import { Component, OnInit, OnDestroy } from '@angular/core';
import { BalanceModel } from 'src/app/models/balance/balance.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user-service/user.service';
import { BalanceSettleModel } from 'src/app/models/balance/balance-settle.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BalanceService } from 'src/app/services/balance-service/balance.service';

@Component({
    templateUrl: './summary-balance.component.html',
    styleUrls: ['./summary-balance.component.scss']
})
export class SummaryBalanceComponent implements OnInit, OnDestroy {

    public balance: BalanceModel;
    public userId = 0;
    public maxBalance: number;
    public shareUrl: string;

    private uid: string;

    private isNotDestroyed = new Subject();

    constructor(
        private balanceService: BalanceService,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private router: Router,
    ) { }

    public ngOnInit() {

        this.userService.userExtract
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe(data => {
                this.userId = data.id;
            });

        this.activatedRoute.parent.params
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe(params => {

                this.uid = params.uid;
                this.shareUrl = `${window.location.origin}/${this.uid}`;

                this.balanceService.GetBalance(this.uid)
                    .pipe(takeUntil(this.isNotDestroyed))
                    .subscribe(data => {
                        this.balance = data;
                        this.maxBalance = Math.max(...data.participantsBalance.map(x => Math.abs(x.value)));
                    });
            });
    }

    public ngOnDestroy(): void {
        this.isNotDestroyed.next();
        this.isNotDestroyed.complete();
    }

    public calculateBarLength(value: number): number {

        if (!this.maxBalance)
            return 0;

        return Math.abs(value) * 100 / this.maxBalance;
    }

    public markAsPaid(settlement: BalanceSettleModel) {

        this.router.navigate(
            ['/trips', this.uid, 'expenses', 'new'],
            {
                relativeTo: this.activatedRoute,
                queryParams: {
                    settlementFrom: settlement.fromParticipantId,
                    settlementTo: settlement.toParticipantId,
                    value: settlement.value
                }
            }
        );
    }
}