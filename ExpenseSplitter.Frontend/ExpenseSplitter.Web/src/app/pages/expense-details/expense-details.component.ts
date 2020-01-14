import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExpenseService } from 'src/app/services/expense-service/expense.service';
import { Expense } from 'src/app/data/expense';
import { UserService } from 'src/app/services/user-service/user.service';
import { Participant } from 'src/app/data/participant';
import { TripService } from 'src/app/services/trip-service/trip.service';
import { ParticipantExtractModel } from 'src/app/models/participant/participant-extract-model';
import { ExpensePart } from 'src/app/data/expense-part';
import { CurrencyPipe } from '@angular/common';

@Component({
    templateUrl: './expense-details.component.html',
    styleUrls: ['./expense-details.component.scss']
})
export class ExpenseDetailsComponent implements OnInit {

    public uid: string;
    public id: number;
    public expense: Expense;
    public userId: number;
    public value: number;
    public stickyHeader: boolean = false;
    public participants = new Array<ParticipantExtractModel>();

    public summary: Array<{ nick: string, value: number }>;

    constructor(
        private expenseService: ExpenseService,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private tripService: TripService,
    ) { }

    public ngOnInit() {
        this.userService.userExtract.subscribe(data => {
            this.userId = data.id;
        });

        this.activatedRoute.params.subscribe(params => {
            this.uid = params.uid;
            this.id = +params.id;

            this.tripService.GetParticipants(this.uid).subscribe(data => {
                this.participants = data;
                this.calculateSummary();
            });

            this.expenseService.GetExpense(this.uid, this.id).subscribe(data => {
                this.expense = data;
                this.calculateSummary();
            });
        });
    }

    public isParticipantInvolvedInPart(participant: ParticipantExtractModel, part: ExpensePart) {
        return part.partParticipants.some(x => x.participantId === participant.id);
    }

    private calculateSummary() {
        if (!this.participants || !this.expense) {
            return;
        }

        this.value = this.expense.parts.reduce((p, c) => p + c.value, 0);

        this.summary = new Array();
        for (const participant of this.participants) {

            this.summary.push({
                nick: participant.nick,
                value: this
                    .expense
                    .parts
                    .filter(x =>
                        x.partParticipants.some(y => y.participantId === participant.id)
                    )
                    .reduce((p, c) => p + c.value / c.partParticipants.length, 0),
            });
        }
    }
}
