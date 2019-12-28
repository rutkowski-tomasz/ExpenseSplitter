import { Component, OnInit, ViewChild } from '@angular/core';
import { TripService } from 'src/app/services/trip-service/trip.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, NgForm, FormArray } from '@angular/forms';
import { Trip } from 'src/app/data/trip';

@Component({
    templateUrl: './trip-edit.component.html',
    styleUrls: ['./trip-edit.component.scss']
})
export class TripEditComponent implements OnInit {

    public uid: string;
    public trip: Trip;

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
        participants: new FormArray([]),
        newParticipantNick: new FormControl(''),
    });

    public get name(): AbstractControl {
        return this.formGroup.get('name');
    }

    public get description(): AbstractControl {
        return this.formGroup.get('description');
    }

    public get participants(): FormArray {
        return this.formGroup.get('participants') as FormArray;
    }

    public get newParticipantNick(): AbstractControl {
        return this.formGroup.get('newParticipantNick');
    }

    constructor(
        private tripService: TripService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) { }

    public ngOnInit() {

        this.activatedRoute.params.subscribe(params => {
            this.uid = params.uid;
            this.tripService.GetTrip(this.uid).subscribe(data => {

                this.name.setValue(data.name);
                this.description.setValue(data.description);

                data.participants.forEach(x => this.addParticipant(x.id, x.name));
            });
        });
    }

    public addParticipant(id?: number, nick?: string)
    {
        console.log(id);
        console.log(nick);
        if (!id) {
            id = 0;
        }

        if (!nick) {
            nick = '';
        }

        this.participants.push(new FormGroup({
            id: new FormControl(id),
            nick: new FormControl(nick, [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(40),
            ]),
        }));
    }

    public onDelete() {

        this.tripService.DeleteTrip(this.uid).subscribe(_ => {
            this.router.navigate(['/trips']);
        });
    }

    public onSubmit() {

        this.formGroup.markAllAsTouched();
        console.log(this.participants);

        if (this.formGroup.valid) {

            const name = this.name.value;
            const description = this.description.value;

            console.log(this.participants);

            // const model: CreateTripModel = { name, description, organizerNick };
            // this.tripService.CreateTrip(model).subscribe(_ => {
            //     this.router.navigate(['/trips']);
            // });
        }
    }
}
