import { Component, OnInit } from '@angular/core';
import { BalanceService } from 'src/app/services/balance-service/balance.service';
import { BalanceResponseModel } from 'src/app/models/balance/balance-response-model';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user-service/user.service';
import { SettleBalance } from 'src/app/models/balance/settle-balance-model';
import { ExpenseService } from 'src/app/services/expense-service/expense.service';
import { UpdateExpenseModel } from 'src/app/models/expense/update-expense-model';
import { ExpenseTypeEnum } from 'src/app/data/expense-type';
import { ConfigService } from 'src/app/services/config-service/config.service';

@Component({
    templateUrl: './balance.component.html',
    styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

    public balance: BalanceResponseModel;
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
            return 100;

        return Math.abs(value) * 100 / this.maxBalance;
    }

    public markAsPaid(settlement: SettleBalance) {

        this.balanceService.markSettlementAsPaid(
            this.uid,
            settlement.value,
            settlement.fromParticipantId,
            settlement.toParticipantId
        ).subscribe(_ => {
            console.log('success');
        });
    }
}