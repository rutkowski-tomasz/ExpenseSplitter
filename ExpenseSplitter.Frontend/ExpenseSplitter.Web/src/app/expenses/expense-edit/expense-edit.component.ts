import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { TripService } from 'src/app/trips/trip-service/trip.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, FormArray, ValidationErrors } from '@angular/forms';
import { ExpenseTypeEnum } from 'src/app/models/expense/expense-type.enum';
import { ExpenseService } from 'src/app/expenses/expense-service/expense.service';
import { startWith, map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth-service/auth.service';
import { ExpensePartModel } from 'src/app/models/expense/expense-part.model';
import { ParticipantModel } from 'src/app/models/participant/participant.model';
import { ExpenseUpdateModel } from 'src/app/models/expense/expense-update.model';
import { ConfigService } from 'src/app/shared/services/config-service/config.service';
import { SettlementQueryModel } from './settlement-query.model';
import { ExpenseDetailsModel } from 'src/app/models/expense/expense-details.model';
import { UserService } from 'src/app/auth/user-service/user.service';
import { ConfirmDiscardChanges } from 'src/app/shared/components/discard-dialog/confirm-discard-changes.interface';

@Component({
    templateUrl: './expense-edit.component.html',
    styleUrls: ['./expense-edit.component.scss']
})
export class ExpenseEditComponent implements OnInit, OnDestroy, ConfirmDiscardChanges {

    public uid: string;
    public id: number;
    public ExpenseTypeEnum = ExpenseTypeEnum;
    public participants: ParticipantModel[];
    public filteredParticipants: Observable<ParticipantModel[]>;
    public expense: ExpenseDetailsModel;

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
    public isSubmitting = false;

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

    public expenseValueMax: number;
    public expenseValueMin: number;
    public get parts(): FormArray {
        return this.formGroup.get('parts') as FormArray;
    }

    public settlementQueryModel: SettlementQueryModel;
    @ViewChild('defaultSettlementName', { static: false }) defaultSettlementName: ElementRef;
    @ViewChild('me', { static: false }) me: ElementRef;

    public payerLabel: string;
    @ViewChild('paidByLabel', { static: true }) paidByLabel: ElementRef;
    @ViewChild('receivedByLabel', { static: false }) receivedByLabel: ElementRef;
    @ViewChild('transferedByLabel', { static: false }) transferedByLabel: ElementRef;

    private isNotDestroyed = new Subject();

    constructor(
        private expenseService: ExpenseService,
        private tripService: TripService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private configService: ConfigService,
        private userService: UserService,
    ) { }

    public ngOnInit() {

        const query = this.activatedRoute.snapshot.queryParams;

        if ('settlementFrom' in query &&
            'settlementTo' in query && 
            'value' in query) {

                this.settlementQueryModel = new SettlementQueryModel(
                    parseInt(query.settlementFrom, 10),
                    parseInt(query.settlementTo, 10),
                    parseFloat(query.value)
                );
            }

        this.activatedRoute.params
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe(params => {

                this.uid = params.uid;
                this.id = params.id;

                this.tripService.GetParticipants(this.uid)
                    .pipe(takeUntil(this.isNotDestroyed))
                    .subscribe(data => {

                        this.loadingCount -= 1;
                        this.participants = data;
                        this.participants.forEach(particpant => {
                            if (this.isClaimedParticipant(particpant.id)) {
                                particpant.nick += ` ${this.me.nativeElement.innerText}`;
                            }
                        });

                        this.prepareDefaultFormValues();
                    });

                if (!this.id) {
                    return;
                }

                this.loadingCount += 1;
                this.expenseService.GetExpense(this.uid, this.id)
                    .pipe(takeUntil(this.isNotDestroyed))
                    .subscribe(data => {

                        this.loadingCount -= 1;
                        this.expense = data;

                        this.prepareDefaultFormValues();
                    });
            });

        this.updatePayerLabel();
        this.loadConfiguration();
    }

    public ngOnDestroy(): void {
        this.isNotDestroyed.next();
        this.isNotDestroyed.complete();
    }

    public prepareDefaultFormValues() {

        if (this.participants && this.participants.length) {
            
            this.SetDefaultPayer();
            this.InitAutocomplete();
            this.AddPart();
            
            if (this.settlementQueryModel) {
                this.SetSettlementDetails();
            }
        }

        if (this.expense) {

            this.name.setValue(this.expense.name);
            this.type.setValue(this.expense.type);
            this.paidAt.setValue(this.expense.paidAt);
    
            if (this.participants) {

                const payer = this.participants.find(x => x.id == this.expense.payerId);
                this.payer.setValue(payer);

                this.removeAllParts();
                for (const part of this.expense.parts) {
                    this.parts.push(this.CreatePart(part.value, part.participantIds));
                }
            }
        }
    }

    public OnSubmit() {

        this.formGroup.markAllAsTouched();

        if (this.formGroup.valid && !this.isSubmitting) {

            this.isSubmitting = true;

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
                this.expenseService.UpdateExpense(this.uid, model)
                    .pipe(takeUntil(this.isNotDestroyed))
                    .subscribe(
                        _ => {
                            this.formGroup.markAsPristine();
                            this.router.navigate(['/trips', this.uid, 'expenses', this.id]);
                        },
                        () => {},
                        () => {
                            this.isSubmitting = false;
                        }
                    );

            } else {

                this.expenseService.CreateExpense(this.uid, model)
                    .pipe(takeUntil(this.isNotDestroyed))
                    .subscribe(
                        _ => {
                            this.formGroup.markAsPristine();
                            this.router.navigate(['/trips', this.uid]);
                        },
                        () => {},
                        () => {
                            this.isSubmitting = false;
                        }
                    );
            }
        }
    }

    public removeAllParts() {
        while (this.parts.length !== 0) {
            this.removePart(0);
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
            value: new FormControl(val, [
                Validators.required,
                this.validNumber(this.expenseValueMin, this.expenseValueMax)
            ]),
            participants: this.createParticipantsCheckboxes(participantIds)
        });

        return group;
    }

    public getPartValueErrors = (part: FormGroup) => {
        return part.controls.value.errors;
    };

    public GetParticipants(part: FormGroup): FormArray {
        return part.get('participants') as FormArray;
    }

    public SetSettlementDetails() {

        const payer = this.participants.find(x => x.id == this.settlementQueryModel.settlementFrom);
        this.payer.setValue(payer);

        this.removeAllParts();
        this.parts.push(this.CreatePart(this.settlementQueryModel.value, [this.settlementQueryModel.settlementTo]));

        this.name.setValue(this.defaultSettlementName.nativeElement.innerText);

        this.type.setValue(ExpenseTypeEnum.Transfer);
    }

    public onDelete() {
        this.expenseService.DeleteExpense(this.uid, this.id)
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe(_ => {
                this.router.navigate(['/trips', this.uid]);
            });
    }

    public isDirty = () => this.formGroup.dirty;

    public isClaimedParticipant(participantId: number): boolean {
        const participant = this.participants.find(x => x.id == participantId);
        if (participant == null) {
            return false;
        }

        const userId = this.userService.userExtract.value.id;
        return participant.claimedUserIds.some(x => x == userId);
    }

    public getPartParticipantErrors = (partGroup: FormGroup) => partGroup.controls.participants.errors;

    private createParticipantsCheckboxes(participants?: number[]): FormArray {

        const array = new FormArray([], [this.atLeastOneChecked()]);
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

    private validNumber(min?: number, max?: number): (AbstractControl) => ValidationErrors | null {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = parseFloat(control.value);

            if (min !== null && !isNaN(value) && value < min) {
                return { tooLow: { min } };
            }

            if (max !== null && !isNaN(value) && value > max) {
                return { tooHigh: { max }};
            }

            return null;
        };
    }

    private atLeastOneChecked(): (FormArray) => ValidationErrors | null {
        return (formArray: FormArray): ValidationErrors | null => {

            const anyChecked = formArray.controls.some(x => x.value);
            return !anyChecked ? { noneChecked: true } : null;
        };
    }

    private updatePayerLabel(): void {

        this.payerLabel = this.paidByLabel.nativeElement.innerText;

        this.type.valueChanges
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe(value => {

                if (value == ExpenseTypeEnum.Expense) {
                    this.payerLabel = this.paidByLabel.nativeElement.innerText;
                } else if (value == ExpenseTypeEnum.Income) {
                    this.payerLabel = this.receivedByLabel.nativeElement.innerText;
                } else if (value == ExpenseTypeEnum.Transfer) {
                    this.payerLabel = this.transferedByLabel.nativeElement.innerText;
                }
            });
    }

    private loadConfiguration() {

        this.configService.GetConstants()
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe(constants => {

                this.name.setValidators([
                    Validators.required,
                    Validators.minLength(constants['ExpenseNameMinLength']),
                    Validators.maxLength(constants['ExpenseNameMaxLength']),
                ]);

                this.expenseValueMin = constants['ExpenseValueMin'];
                this.expenseValueMax = constants['ExpenseValueMax'];

                for (const partGroup of this.parts.controls) {
                    const valueControl = (partGroup as FormGroup).controls.value;

                    valueControl.setValidators([
                        Validators.required,
                        this.validNumber(this.expenseValueMin, this.expenseValueMax)
                    ]);
                }

                this.expenseNameMaxLength = constants['ExpenseNameMaxLength'];
            });
    }
}

