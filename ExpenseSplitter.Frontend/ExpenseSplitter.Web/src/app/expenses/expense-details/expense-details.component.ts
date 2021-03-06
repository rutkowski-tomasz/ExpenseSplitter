import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExpenseService } from 'src/app/services/expense-service/expense.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { TripService } from 'src/app/services/trip-service/trip.service';
import { ParticipantModel } from 'src/app/models/participant/participant.model';
import { ExpenseDetailsModel } from 'src/app/models/expense/expense-details.model';
import { ExpensePartModel } from 'src/app/models/expense/expense-part.model';
import { takeUntil, filter, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ExpenseTypeEnum } from 'src/app/models/expense/expense-type.enum';

@Component({
    templateUrl: './expense-details.component.html',
    styleUrls: ['./expense-details.component.scss']
})
export class ExpenseDetailsComponent implements OnInit, OnDestroy {

    public uid: string;
    public id: number;
    public expense: ExpenseDetailsModel;
    public userId: number;
    public value: number;
    public stickyHeader = false;
    public participants = new Array<ParticipantModel>();
    public payerNick: string;
    public ExpenseTypeEnum = ExpenseTypeEnum;

    public summary: Array<{ id: number, nick: string, value: number }>;

    private isNotDestroyed = new Subject();

    constructor(
        private expenseService: ExpenseService,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private tripService: TripService,
    ) { }

    public ngOnInit() {
        this.userService.userExtract
            .pipe(takeUntil(this.isNotDestroyed), filter(x => x.id !== null), take(1))
            .subscribe(data => {
                this.userId = data.id;
            });

        this.activatedRoute.params
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe(params => {
                this.uid = params.uid;
                this.id = +params.id;

                this.tripService.GetParticipants(this.uid)
                    .pipe(takeUntil(this.isNotDestroyed))
                    .subscribe(data => {
                        this.participants = data;
                        this.calculateSummary();
                    });

                this.expenseService.GetExpense(this.uid, this.id)
                    .pipe(takeUntil(this.isNotDestroyed))
                    .subscribe(data => {
                        this.expense = data;
                        this.calculateSummary();
                    });
            });
    }

    public ngOnDestroy(): void {
        this.isNotDestroyed.next();
        this.isNotDestroyed.complete();
    }

    public isParticipantInvolvedInPart(participant: ParticipantModel, part: ExpensePartModel): boolean {
        return part.participantIds.some(x => x === participant.id);
    }

    public isClaimedParticipant(participantId: number): boolean {
        const participant = this.participants.find(x => x.id === participantId);
        if (participant == null) {
            return false;
        }

        return participant.claimedUserIds.some(x => x === this.userId);
    }

    private calculateSummary() {
        if (!this.participants || !this.participants.length || !this.expense) {
            return;
        }

        this.payerNick = this.participants.find(x => x.id === this.expense.payerId).nick;
        this.value = this.expense.parts.reduce((p, c) => p + c.value, 0);

        this.summary = new Array();
        for (const participant of this.participants) {

            this.summary.push({
                id: participant.id,
                nick: participant.nick,
                value: this
                    .expense
                    .parts
                    .filter(x =>
                        x.participantIds.some(y => y === participant.id)
                    )
                    .reduce((p, c) => p + c.value / c.participantIds.length, 0),
            });
        }
    }
}
