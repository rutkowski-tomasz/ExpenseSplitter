import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { TripService } from 'src/app/services/trip-service/trip.service';
import { CreateTripModel } from 'src/app/models/trip/create-trip-model';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
    templateUrl: './trips-create.component.html',
    styleUrls: ['./trips-create.component.scss']
})
export class TripsCreateComponent implements OnInit {

    @ViewChild('form', {static: false}) form: NgForm;

    public formGroup = new FormGroup({
        name: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
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

    public get name(): AbstractControl {
        return this.formGroup.get('name');
    }

    public get description(): AbstractControl {
        return this.formGroup.get('description');
    }

    public get organizerNick(): AbstractControl {
        return this.formGroup.get('organizerNick');
    }

    constructor(
        private tripService: TripService,
        private router: Router,
        private userService: UserService,
    ) { }

    ngOnInit() {
        
        this.userService.userExtract.subscribe(userExtract => {
            this.organizerNick.setValue(userExtract.nick);
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
