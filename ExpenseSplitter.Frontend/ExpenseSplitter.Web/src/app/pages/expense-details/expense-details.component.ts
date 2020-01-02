import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExpenseService } from 'src/app/services/expense-service/expense.service';
import { Expense } from 'src/app/data/expense';
import { UserService } from 'src/app/services/user-service/user.service';
import { Participant } from 'src/app/data/participant';

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

    public summary: Array<{ id: number, nick: string, value: number }>;

    constructor(
        private expenseService: ExpenseService,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
    ) { }

    public ngOnInit() {
        this.userService.userExtract.subscribe(data => {
            this.userId = data.id;
        });

        this.activatedRoute.params.subscribe(params => {
            this.uid = params.uid;
            this.id = +params.id;

            this.expenseService.GetExpense(this.uid, this.id).subscribe(data => {
                this.expense = data;
                console.log(data.parts);
                this.calculateSummary();
            });
        });
    }

    private calculateSummary() {
        this.value = this.expense.parts.reduce((p, c) => p + c.value, 0);

        this.summary = new Array();
        for (const part of this.expense.parts) {
            const perParticipant = part.value / part.participants.length;

            for (const participant of part.participants) {
                let participantSummary = this.summary.find(x => x.id == participant.id);
                if (!participantSummary) {
                    participantSummary = {
                        id: participant.id,
                        nick: participant.name,
                        value: 0.0,
                    }
                }

                participantSummary.value += perParticipant;
                this.summary.push(participantSummary);
            }
        }
    }
}

