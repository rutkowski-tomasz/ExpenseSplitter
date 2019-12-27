import { Component, OnInit } from '@angular/core';
import { TripService } from 'src/app/services/trip-service/trip.service';
import { CreateTripModel } from 'src/app/models/trip/create-trip-model';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ExpenseTypeEnum } from 'src/app/data/expense-type';
import { CreateExpenseModel } from 'src/app/models/expense/create-expense-model';
import { ExpenseService } from 'src/app/services/expense-service/expense.service';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Participant } from 'src/app/data/participant';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
    templateUrl: './expense-create.component.html',
    styleUrls: ['./expense-create.component.scss']
})
export class ExpenseCreateComponent implements OnInit {

    public uid: string;
    public ExpenseTypeEnum = ExpenseTypeEnum;
    public participants: Participant[];
    public filteredParticipants: Observable<Participant[]>;

    public formGroup = new FormGroup({
        name: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(40),
        ]),
        type: new FormControl(ExpenseTypeEnum.Expense, [
            Validators.required,
        ]),
        paidAt: new FormControl(new Date(), [
            Validators.required,
        ]),
        payer: new FormControl('', [
            Validators.required,
        ]),
    });

    public get name(): AbstractControl {
        return this.formGroup.get('name');
    }

    public get type(): AbstractControl {
        return this.formGroup.get('type');
    }

    public get paidAt(): AbstractControl {
        return this.formGroup.get('paidAt');
    }

    public get payer(): AbstractControl {
        return this.formGroup.get('payer');
    }

    constructor(
        private expenseService: ExpenseService,
        private tripService: TripService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
    ) { }

    public ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            this.uid = params.uid;

            this.tripService.GetTrip(this.uid).subscribe(data => {
                this.participants = data.participants;

                this.SetDefaultPayer();
                this.InitAutocomplete();
            });
        });
    }

    public OnSubmit() {

        if (this.formGroup.valid) {

            const model = new CreateExpenseModel();
            model.name = this.name.value;
            model.type = this.type.value;
            model.paidAt = this.paidAt.value;
            model.payerId = this.payer.value.id;

            this.expenseService.CreateExpense(this.uid, model).subscribe(_ => {
                this.router.navigate(['/trips', this.uid]);
            });
        }
    }

    public SetDefaultPayer()
    {
        const userId = +this.authService.GetDecodedToken().UserId;
        const payer = this.participants.find(x => x.userId === userId);
        this.payer.setValue(payer);
    }

    public InitAutocomplete() {
        this.filteredParticipants = this.payer.valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.name),
                map(name => name ? this.filterParticipants(name) : this.participants.slice())
            );
    }

    public DisplayParticipant(participant?: Participant): string | undefined {
        return participant ? participant.name : undefined;
    }

    private filterParticipants(value: string): Participant[] {
        const filterValue = value.toLowerCase();
        return this.participants.filter(option => option.name.toLowerCase().includes(filterValue));
    }
}

