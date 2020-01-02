import { Component, OnInit } from '@angular/core';
import { TripService } from 'src/app/services/trip-service/trip.service';
import { CreateTripModel } from 'src/app/models/trip/create-trip-model';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder, FormArray } from '@angular/forms';
import { ExpenseTypeEnum } from 'src/app/data/expense-type';
import { CreateExpenseModel } from 'src/app/models/expense/create-expense-model';
import { ExpenseService } from 'src/app/services/expense-service/expense.service';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Participant } from 'src/app/data/participant';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { ExpensePart } from 'src/app/data/expense-part';
import { ExpensePartModel } from 'src/app/models/expense/expense-part-model';

@Component({
    templateUrl: './expense-edit.component.html',
    styleUrls: ['./expense-edit.component.scss']
})
export class ExpenseEditComponent implements OnInit {

    public uid: string;
    public id: number;
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
        parts: new FormArray([ ])
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

    public get parts(): FormArray {
        return this.formGroup.get('parts') as FormArray;
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
            this.id = params.id;

            this.tripService.GetTrip(this.uid).subscribe(data => {
                this.participants = data.participants;

                this.SetDefaultPayer();
                this.InitAutocomplete();
                this.AddPart();
            });

            if (!this.id) {
                return;
            }

            this.expenseService.GetExpense(this.uid, this.id).subscribe(data => {
                this.name.setValue(data.name);
                this.type.setValue(data.type);
                this.paidAt.setValue(data.paidAt);
                this.payer.setValue(data.payer);

                while (this.parts.length !== 0) {
                    this.parts.removeAt(0);
                }

                for (const part of data.parts) {
                    this.parts.push(this.CreatePart(part.value, part.participants));
                }
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
            model.parts = new Array<ExpensePartModel>();

            for (const part of this.parts.controls) {

                const value = part.get('value').value;
                const participantControls = (part.get('participants') as FormArray).controls;

                const participantIds = [];
                for (let i = 0; i < participantControls.length; i++) {
                    if (!participantControls[i].value)
                        continue;
                    
                        participantIds.push(this.participants[i].id);
                }

                model.parts.push({ value, participantIds });
            }

            this.expenseService.CreateExpense(this.uid, model).subscribe(_ => {
                this.router.navigate(['/trips', this.uid]);
            });
        }
    }

    public removePart(index: number) {
        this.parts.removeAt(index);
    }

    public SetDefaultPayer() {

        const userId = +this.authService.GetDecodedToken().UserId;
        const payer = this.participants.find(x => x.usersClaimed.some(y => y.id === userId));

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

    public AddPart()
    {
        this.parts.push(this.CreatePart());
    }

    public CreatePart(value?: number, participants?: Participant[]): FormGroup {
        const val = value ? value.toString() : '';

        const group = new FormGroup({
            value: new FormControl(val, Validators.pattern(/^\d+(\.\d{0,2})?$/)),
            participants: this.createParticipantsCheckboxes(participants)
        });

        return group;
    }

    public GetParticipants(part: FormGroup): FormArray {
        return part.get('participants') as FormArray;
    }

    private createParticipantsCheckboxes(participants?: Participant[]): FormArray {

        const array = new FormArray([]);
        for (let [i, participant] of this.participants.entries()) {

            let checked = false;
            if (participants) {
                checked = participants.some(x => x.id == participant.id);
            }
            else if (this.parts.controls.length) {
                checked = this.parts.controls[this.parts.controls.length - 1].value.participants[i];
            }

            array.push(new FormControl(checked));
        }

        return array;
    }

    private filterParticipants(value: string): Participant[] {
        const filterValue = value.toLowerCase();
        return this.participants.filter(option => option.name.toLowerCase().includes(filterValue));
    }
}

