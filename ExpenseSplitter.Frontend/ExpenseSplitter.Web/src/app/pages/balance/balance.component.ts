import { Component, OnInit } from '@angular/core';
import { BalanceService } from 'src/app/services/balance-service/balance.service';
import { BalanceModel } from 'src/app/models/balance/balance.model';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user-service/user.service';
import { BalanceSettleModel } from 'src/app/models/balance/balance-settle.model';
import { ExpenseService } from 'src/app/services/expense-service/expense.service';
import { ExpenseUpdateModel } from 'src/app/models/expense/expense-update.model';
import { ExpenseTypeEnum } from 'src/app/models/expense/expense-type.enum';
import { ConfigService } from 'src/app/services/config-service/config.service';

@Component({
    templateUrl: './balance.component.html',
    styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

    public balance: BalanceModel;
    public userId = 0;
    public maxBalance: number;
    public shareUrl: string;

    private uid: string;
    a;

    constructor(
        private balanceService: BalanceService,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private configService: ConfigService,
    ) { }

    public ngOnInit() {

        this.userService.userExtract.subscribe(data => {
            this.userId = data.id;
        });

        this.activatedRoute.parent.params.subscribe(params => {

            this.uid = params.uid;
            this.shareUrl = `${window.location.origin}/${this.uid}`;

            this.balanceService.GetBalance(this.uid).subscribe(data => {
                this.balance = data;
                this.maxBalance = Math.max(...data.participantsBalance.map(x => Math.abs(x.value)));
            });
        });
    }

    public calculateBarLength(value: number): number {

        if (!this.maxBalance)
            return 0;

        return Math.abs(value) * 100 / this.maxBalance;
    }

    public markAsPaid(settlement: BalanceSettleModel) {

        // this.balanceService.markSettlementAsPaid(
        //     this.uid,
        //     settlement.value,
        //     settlement.fromParticipantId,
        //     settlement.toParticipantId
        // ).subscribe(_ => {
        //     console.log('success');
        // });
    }
}