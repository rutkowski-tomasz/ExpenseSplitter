import { Component, OnInit, ViewChild } from '@angular/core';
import { TripService } from 'src/app/services/trip-service/trip.service';
import { TripCreateModel } from 'src/app/models/trip/trip-create.model';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user-service/user.service';
import { ConfigService } from 'src/app/services/config-service/config.service';
import { ConfirmDiscardChanges } from 'src/app/shared/discard/confirm-discard-changes.interface';

@Component({
    templateUrl: './trips-create.component.html',
    styleUrls: ['./trips-create.component.scss']
})
export class TripsCreateComponent implements OnInit, ConfirmDiscardChanges {

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

    constructor(
        private tripService: TripService,
        private router: Router,
        private userService: UserService,
        private configService: ConfigService,
    ) { }

    public ngOnInit() {
        
        this.isLoading = true;
        this.userService.userExtract.subscribe(userExtract => {

            if (userExtract.nick !== null) {
                this.isLoading = false;
            }

            this.organizerNick.setValue(userExtract.nick);
        });

        this.loadConfiguration();
    }

    public isDirty = () => this.formGroup.dirty;

    public submit() {

        this.formGroup.markAllAsTouched();

        if (this.formGroup.valid) {

            const name = this.name.value;
            const description = this.description.value;
            const organizerNick = this.organizerNick.value;

            const model: TripCreateModel = { name, description, organizerNick };
            this.tripService.CreateTrip(model).subscribe(_ => {
                this.router.navigate(['/trips']);
            })
        }
    }

    private loadConfiguration() {

        this.configService.GetConstants().subscribe(constants => {

            this.name.setValidators([
                Validators.required,
                Validators.minLength(constants['TripNameMinLength']),
                Validators.maxLength(constants['TripNameMaxLength']),
            ]);

            this.description.setValidators([
                Validators.minLength(constants['TripDescriptionMinLength']),
                Validators.maxLength(constants['TripDescriptionMaxLength']),
            ]);

            this.organizerNick.setValidators([
                Validators.required,
                Validators.minLength(constants['ParticipantNameMinLength']),
                Validators.maxLength(constants['ParticipantNameMaxLength']),
            ])

            this.tripNameMaxLength = constants['TripNameMaxLength'];
            this.tripDescriptionMaxLength = constants['TripDescriptionMaxLength'];
            this.participantNameMaxLength = constants['ParticipantNameMaxLength'];
        });
    }
}
