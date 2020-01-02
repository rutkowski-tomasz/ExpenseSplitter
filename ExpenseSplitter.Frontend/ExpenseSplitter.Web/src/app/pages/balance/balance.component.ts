import { Component, OnInit } from '@angular/core';
import { BalanceService } from 'src/app/services/balance-service/balance.service';
import { BalanceResponseModel } from 'src/app/models/balance/balance-response-model';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
    templateUrl: './balance.component.html',
    styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

    public balance: BalanceResponseModel;
    public userId = 0;
    public maxBalance: number;

    constructor(
        private balanceService: BalanceService,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
    ) { }

    public ngOnInit() {

        this.userService.userExtract.subscribe(data => {
            this.userId = data.id;
        });

        this.activatedRoute.parent.params.subscribe(params => {

            const uid = params.uid;

            this.balanceService.GetBalance(uid).subscribe(data => {
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
}