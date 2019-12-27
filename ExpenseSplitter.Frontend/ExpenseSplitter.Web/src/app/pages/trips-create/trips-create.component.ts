import { Component, OnInit } from '@angular/core';
import { TripService } from 'src/app/services/trip-service/trip.service';
import { CreateTripModel } from 'src/app/models/trip/create-trip-model';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

@Component({
    templateUrl: './trips-create.component.html',
    styleUrls: ['./trips-create.component.scss']
})
export class TripsCreateComponent implements OnInit {

    public formGroup = new FormGroup({
        name: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(40),
        ]),
        description: new FormControl('', [
            Validators.maxLength(50),
        ]),
    });

    public get name(): AbstractControl {
        return this.formGroup.get('name');
    }

    public get description(): AbstractControl {
        return this.formGroup.get('description');
    }

    constructor(
        private tripService: TripService,
        private router: Router,
    ) { }

    ngOnInit() {
    }

    submit() {

        if (this.formGroup.valid) {

            const name = this.name.value;
            const description = this.description.value;

            const model: CreateTripModel = { name, description };
            this.tripService.CreateTrip(model).subscribe(_ => {
                this.router.navigate(['/trips']);
            })
        }
    }
}
