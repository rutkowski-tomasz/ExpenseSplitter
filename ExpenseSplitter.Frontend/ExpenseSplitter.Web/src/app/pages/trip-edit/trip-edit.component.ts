import { Component, OnInit, ViewChild } from '@angular/core';
import { TripService } from 'src/app/services/trip-service/trip.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, NgForm, FormArray } from '@angular/forms';
import { Trip } from 'src/app/data/trip';
import { UpdateTripModel } from 'src/app/models/trip/update-trip-model';
import { UpdateTripModelParticipant } from 'src/app/models/trip/update-trip-model-participant';

@Component({
    templateUrl: './trip-edit.component.html',
    styleUrls: ['./trip-edit.component.scss']
})
export class TripEditComponent implements OnInit {

    public uid: string;

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

    public removeParticipant(index: number) {
        this.participants.removeAt(index);
    }

    public onDelete() {

        this.tripService.DeleteTrip(this.uid).subscribe(_ => {
            this.router.navigate(['/trips']);
        });
    }

    public onSubmit() {

        this.formGroup.markAllAsTouched();

        if (this.formGroup.valid) {

            const uid = this.uid;
            const name = this.name.value;
            const description = this.description.value;
            const participants = new Array<UpdateTripModelParticipant>();
            this.participants.value.forEach(p =>
                participants.push({ id: p.id, nick: p.nick })
            );

            const model: UpdateTripModel = { uid, name, description, participants };
            this.tripService.UpdateTrip(model).subscribe(_ => {
                this.router.navigate(['/trips', uid]);
            });
        }
    }
}
