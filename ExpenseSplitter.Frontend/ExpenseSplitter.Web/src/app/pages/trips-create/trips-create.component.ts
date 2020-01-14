import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { TripService } from 'src/app/services/trip-service/trip.service';
import { CreateTripModel } from 'src/app/models/trip/create-trip-model';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user-service/user.service';
import { ConfigService } from 'src/app/services/config-service/config.service';

@Component({
    templateUrl: './trips-create.component.html',
    styleUrls: ['./trips-create.component.scss']
})
export class TripsCreateComponent implements OnInit {

    @ViewChild('form', {static: false}) form: NgForm;

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

    ngOnInit() {
        
        this.userService.userExtract.subscribe(userExtract => {
            this.organizerNick.setValue(userExtract.nick);
        });

        this.loadConfiguration();
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

    submit() {

        this.formGroup.markAllAsTouched();

        if (this.formGroup.valid) {

            const name = this.name.value;
            const description = this.description.value;
            const organizerNick = this.organizerNick.value;

            const model: CreateTripModel = { name, description, organizerNick };
            this.tripService.CreateTrip(model).subscribe(_ => {
                this.router.navigate(['/trips']);
            })
        }
    }
}
