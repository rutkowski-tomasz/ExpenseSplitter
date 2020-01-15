import { Component, OnInit } from '@angular/core';
import { TripService } from 'src/app/services/trip-service/trip.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, FormArray } from '@angular/forms';
import { ExpenseTypeEnum } from 'src/app/models/expense/expense-type.enum';
import { ExpenseService } from 'src/app/services/expense-service/expense.service';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { ExpensePartModel } from 'src/app/models/expense/expense-part.model';
import { ParticipantModel } from 'src/app/models/participant/participant.model';
import { ExpenseUpdateModel } from 'src/app/models/expense/expense-update.model';
import { ConfirmDiscardChanges } from 'src/app/shared/discard/confirm-discard-changes.interface';
import { ConfigService } from 'src/app/services/config-service/config.service';

@Component({
    templateUrl: './expense-edit.component.html',
    styleUrls: ['./expense-edit.component.scss']
})
export class ExpenseEditComponent implements OnInit, ConfirmDiscardChanges {

    public uid: string;
    public id: number;
    public ExpenseTypeEnum = ExpenseTypeEnum;
    public participants: ParticipantModel[];
    public filteredParticipants: Observable<ParticipantModel[]>;

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
    public loadingCount = 1;

    public expenseNameMaxLength = 0;
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
        private configService: ConfigService,
    ) { }

    public ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            this.uid = params.uid;
            this.id = params.id;

            this.tripService.GetParticipants(this.uid).subscribe(data => {
                this.loadingCount -= 1;
                this.participants = data;

                this.SetDefaultPayer();
                this.InitAutocomplete();
                this.AddPart();
            });

            if (!this.id) {
                return;
            }

            this.loadingCount += 1;
            this.expenseService.GetExpense(this.uid, this.id).subscribe(data => {
                this.loadingCount -= 1;

                this.name.setValue(data.name);
                this.type.setValue(data.type);
                this.paidAt.setValue(data.paidAt);

                const payer = this.participants.find(x => x.id == data.payerId);
                this.payer.setValue(payer);

                while (this.parts.length !== 0) {
                    this.parts.removeAt(0);
                }

                for (const part of data.parts) {
                    this.parts.push(this.CreatePart(part.value, part.participantIds));
                }
            });
        });

        this.loadConfiguration();
    }

    public OnSubmit() {

        if (this.formGroup.valid) {

            const model = new ExpenseUpdateModel();
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

            if (this.id) {

                model.id = this.id;
                this.expenseService.UpdateExpense(this.uid, model).subscribe(_ => {
                    this.formGroup.markAsPristine();
                    this.router.navigate(['/trips', this.uid, 'expenses', this.id]);
                });

            } else {

                this.expenseService.CreateExpense(this.uid, model).subscribe(_ => {
                    this.formGroup.markAsPristine();
                    this.router.navigate(['/trips', this.uid]);
                });
            }
        }
    }

    public removePart(index: number) {
        this.parts.removeAt(index);
    }

    public SetDefaultPayer() {

        if (this.payer.value.length !== 0) {
            return;
        }

        const userId = +this.authService.GetDecodedToken().UserId;
        const payer = this.participants.find(x => x.claimedUserIds.some(y => y === userId));

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

    public DisplayParticipant(participant?: ParticipantModel): string | undefined {
        return participant ? participant.nick : undefined;
    }

    public AddPart() {
        this.parts.push(this.CreatePart());
    }

    public CreatePart(value?: number, participantIds?: number[]): FormGroup {
        const val = value ? value.toString() : '';

        const group = new FormGroup({
            value: new FormControl(val, Validators.pattern(/^\d+(\.\d{0,2})?$/)),
            participants: this.createParticipantsCheckboxes(participantIds)
        });

        return group;
    }

    public GetParticipants(part: FormGroup): FormArray {
        return part.get('participants') as FormArray;
    }

    public onDelete() {
        this.expenseService.DeleteExpense(this.uid, this.id).subscribe(_ => {
            this.router.navigate(['/trips', this.uid]);
        });
    }

    public isDirty = () => this.formGroup.dirty;

    private createParticipantsCheckboxes(participants?: number[]): FormArray {

        const array = new FormArray([]);
        for (let [i, participant] of this.participants.entries()) {

            let checked = false;
            if (participants) {
                checked = participants.some(x => x == participant.id);
            }
            else if (this.parts.controls.length) {
                checked = this.parts.controls[this.parts.controls.length - 1].value.participants[i];
            }

            array.push(new FormControl(checked));
        }

        return array;
    }

    private filterParticipants(value: string): ParticipantModel[] {
        const filterValue = value.toLowerCase();
        return this.participants.filter(option => option.nick.toLowerCase().includes(filterValue));
    }
    
    private loadConfiguration() {

        this.configService.GetConstants().subscribe(constants => {

            this.name.setValidators([
                Validators.required,
                Validators.minLength(constants['ExpenseNameMinLength']),
                Validators.maxLength(constants['ExpenseNameMaxLength']),
            ])

            this.expenseNameMaxLength = constants['ExpenseNameMaxLength'];
        });
    }
}

