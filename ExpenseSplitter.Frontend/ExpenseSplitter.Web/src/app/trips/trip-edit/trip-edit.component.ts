import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { TripService } from 'src/app/services/trip-service/trip.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, NgForm, FormArray, ValidationErrors } from '@angular/forms';
import { TripUpdateModel } from 'src/app/models/trip/trip-update.model';
import { TripParticipantModel } from 'src/app/models/trip/trip-participant.model';
import { ConfirmDiscardChanges } from 'src/app/shared/components/discard-dialog/confirm-discard-changes.interface';
import { ConfigService } from 'src/app/services/config-service/config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TripDetailsModel } from 'src/app/models/trip/trip-details.model';
import { MatSnackBar } from '@angular/material';

@Component({
    templateUrl: './trip-edit.component.html',
    styleUrls: ['./trip-edit.component.scss']
})
export class TripEditComponent implements OnInit, OnDestroy, ConfirmDiscardChanges {

    public uid: string;
    private trip: TripDetailsModel;

    public formGroup = new FormGroup({
        name: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(40),
        ]),
        description: new FormControl('', [
            Validators.maxLength(50),
        ]),
        participants: new FormArray([], [
            Validators.required,
            Validators.minLength(1)
        ]),
    });
    public isLoading = false;

    public tripNameMaxLength = 0;
    public get name(): AbstractControl {
        return this.formGroup.get('name');
    }

    public tripDescriptionMaxLength = 0;
    public get description(): AbstractControl {
        return this.formGroup.get('description');
    }

    public participantNameMaxLength = 0;
    public participantNameMinLength = 0;
    public get participants(): FormArray {
        return this.formGroup.get('participants') as FormArray;
    }

    public isSubmitting = false;

    @ViewChild('cantRemovePartipantInvolvedInExpenses', { static: false }) cantRemovePartipantInvolvedInExpenses: ElementRef;

    private isNotDestroyed = new Subject();

    constructor(
        private tripService: TripService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private configService: ConfigService,
        private snackBar: MatSnackBar,
    ) { }

    public ngOnInit() {

        this.activatedRoute.params
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe(params => {

                this.uid = params.uid;
                this.isLoading = true;
                this.tripService.GetTrip(this.uid)
                    .pipe(takeUntil(this.isNotDestroyed))
                    .subscribe(data => {

                        this.isLoading = false;

                        this.trip = data;
                        this.name.setValue(data.name);
                        this.description.setValue(data.description);

                        data.participants.forEach(x => this.addParticipant(x.id, x.nick));
                    });
            });

        this.loadConfiguration();
    }

    public ngOnDestroy(): void {
        this.isNotDestroyed.next();
        this.isNotDestroyed.complete();
    }

    public addParticipant(id?: number, nick?: string)
    {
        id = id ? id : 0;
        nick = nick ? nick : '';

        const validators = [ Validators.required ];
        if (this.participantNameMinLength) {
            validators.push( Validators.minLength(this.participantNameMinLength) );
        }
        if (this.participantNameMaxLength) {
            validators.push( Validators.maxLength(this.participantNameMaxLength) );
        }
        validators.push(this.uniqueNick());

        this.participants.push(new FormGroup({
            id: new FormControl(id),
            nick: new FormControl(nick, validators),
        }));
    }

    public uniqueNick(): (AbstractControl) => ValidationErrors | null {
        return (control: AbstractControl): ValidationErrors | null => {

            const value = control.value.trim().toLowerCase();

            for (const participantGroup of this.participants.controls) {
                const nickControl = participantGroup.get('nick');

                if (control == nickControl) {
                    continue;
                }

                if (nickControl.value.trim().toLowerCase() !== value) {
                    continue;
                }

                return { notUnique: true };
            }

            return null;
        };
    }

    public removeParticipant(index: number, participantFormGroup: FormGroup) {
        
        const hasExpenses = this.hasAnyExpenses(participantFormGroup);

        if (hasExpenses) {
            this.snackBar.open(this.cantRemovePartipantInvolvedInExpenses.nativeElement.innerText);
            return;
        }

        this.participants.removeAt(index);
    }

    public onDelete() {

        this.tripService.LeaveTrip(this.uid)
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe(_ => {

                this.formGroup.markAsPristine();
                this.router.navigate(['/trips']);
            });
    }

    public onSubmit() {

        this.formGroup.markAllAsTouched();

        if (this.formGroup.valid && !this.isSubmitting) {

            this.isSubmitting = true;

            const uid = this.uid;
            const name = this.name.value;
            const description = this.description.value;
            const participants = new Array<TripParticipantModel>();
            this.participants.value.forEach(p =>
                participants.push({ id: p.id, nick: p.nick })
            );

            const model: TripUpdateModel = { uid, name, description, participants };
            this.tripService.UpdateTrip(model)
                .pipe(takeUntil(this.isNotDestroyed))
                .subscribe(
                    _ => {
                        this.formGroup.markAsPristine();
                        this.router.navigate(['/trips', uid]);
                    },
                    () => {},
                    () => {
                        this.isSubmitting = false;
                    }
                );
        }
    }

    public isDirty = () => this.formGroup.dirty;

    public hasAnyExpenses(participantFormGroup: FormGroup): boolean {

        const id: number = participantFormGroup.value.id;
        const participant = this.trip.participants.find(x => x.id === id);
        return participant ? participant.hasAnyExpenses : false;
    }

    private loadConfiguration() {

        this.configService.GetConstants()
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe(constants => {

                this.name.setValidators([
                    Validators.required,
                    Validators.minLength(constants['TripNameMinLength']),
                    Validators.maxLength(constants['TripNameMaxLength']),
                ]);

                this.description.setValidators([
                    Validators.minLength(constants['TripDescriptionMinLength']),
                    Validators.maxLength(constants['TripDescriptionMaxLength']),
                ]);

                this.tripNameMaxLength = constants['TripNameMaxLength'];
                this.tripDescriptionMaxLength = constants['TripDescriptionMaxLength'];
                this.participantNameMinLength = constants['ParticipantNameMinLength'];
                this.participantNameMaxLength = constants['ParticipantNameMaxLength'];
            });
    }
}
