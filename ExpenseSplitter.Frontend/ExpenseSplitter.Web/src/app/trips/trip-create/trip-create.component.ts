import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { TripService } from 'src/app/services/trip-service/trip.service';
import { TripCreateModel } from 'src/app/models/trip/trip-create.model';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user-service/user.service';
import { ConfirmDiscardChanges } from 'src/app/shared/components/discard-dialog/confirm-discard-changes.interface';
import { ConfigService } from 'src/app/services/config-service/config.service';
import { Subject } from 'rxjs';
import { takeUntil, filter, take } from 'rxjs/operators';

@Component({
    templateUrl: './trip-create.component.html',
    styleUrls: ['./trip-create.component.scss']
})
export class TripCreateComponent implements OnInit, OnDestroy, ConfirmDiscardChanges {

    public formGroup = new FormGroup({
        name: new FormControl('', [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(40),
        ]),
        description: new FormControl('', [
            Validators.maxLength(50),
        ]),
        organizerNick: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(40),
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
    public get organizerNick(): AbstractControl {
        return this.formGroup.get('organizerNick');
    }

    public isSubmitting = false;

    private isNotDestroyed = new Subject();

    constructor(
        private tripService: TripService,
        private router: Router,
        private userService: UserService,
        private configService: ConfigService,
    ) { }

    public ngOnInit() {

        this.isLoading = true;
        this.userService.userExtract
            .pipe(takeUntil(this.isNotDestroyed), filter(x => x.id !== null), take(1))
            .subscribe(userExtract => {

                this.isLoading = false;
                this.organizerNick.setValue(userExtract.nick);
            });

        this.loadConfiguration();
    }

    public ngOnDestroy(): void {
        this.isNotDestroyed.next();
        this.isNotDestroyed.complete();
    }

    public isDirty = () => this.formGroup.dirty;

    public onSubmit() {

        this.formGroup.markAllAsTouched();

        if (this.formGroup.valid && !this.isSubmitting) {

            this.isSubmitting = true;

            const name = this.name.value;
            const description = this.description.value;
            const organizerNick = this.organizerNick.value;

            const model: TripCreateModel = { name, description, organizerNick };
            this.tripService.CreateTrip(model)
                .pipe(takeUntil(this.isNotDestroyed))
                .subscribe(
                    _ => {
                        this.formGroup.markAsPristine();
                        this.router.navigate(['/trips']);
                    },
                    () => {},
                    () => {
                        this.isSubmitting = true;
                    }
                );
        }
    }

    private loadConfiguration() {

        this.configService.GetConstants()
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe(constants => {

                this.name.setValidators([
                    Validators.required,
                    Validators.minLength(constants.TripNameMinLength),
                    Validators.maxLength(constants.TripNameMaxLength),
                ]);

                this.description.setValidators([
                    Validators.minLength(constants.TripDescriptionMinLength),
                    Validators.maxLength(constants.TripDescriptionMaxLength),
                ]);

                this.organizerNick.setValidators([
                    Validators.required,
                    Validators.minLength(constants.ParticipantNameMinLength),
                    Validators.maxLength(constants.ParticipantNameMaxLength),
                ]);

                this.tripNameMaxLength = constants.TripNameMaxLength;
                this.tripDescriptionMaxLength = constants.TripDescriptionMaxLength;
                this.participantNameMaxLength = constants.ParticipantNameMaxLength;
            });
    }
}
