import { Component, OnInit, ViewChild } from '@angular/core';
import { TripService } from 'src/app/services/trip-service/trip.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, NgForm, FormArray } from '@angular/forms';
import { TripUpdateModel } from 'src/app/models/trip/trip-update.model';
import { TripParticipantModel } from 'src/app/models/trip/trip-participant.model';
import { ConfigService } from 'src/app/services/config-service/config.service';
import { ConfirmDiscardChanges } from 'src/app/shared/discard/confirm-discard-changes.interface';

@Component({
    templateUrl: './trip-edit.component.html',
    styleUrls: ['./trip-edit.component.scss']
})
export class TripEditComponent implements OnInit, ConfirmDiscardChanges {

    public uid: string;

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

    constructor(
        private tripService: TripService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private configService: ConfigService,
    ) { }

    public ngOnInit() {

        this.activatedRoute.params.subscribe(params => {
            this.uid = params.uid;
            this.isLoading = true;
            this.tripService.GetTrip(this.uid).subscribe(data => {

                this.isLoading = false;
                this.name.setValue(data.name);
                this.description.setValue(data.description);

                data.participants.forEach(x => this.addParticipant(x.id, x.nick));
            });
        });

        this.loadConfiguration();
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

        this.participants.push(new FormGroup({
            id: new FormControl(id),
            nick: new FormControl(nick, validators),
        }));
    }

    public removeParticipant(index: number) {
        this.participants.removeAt(index);
    }

    public onDelete() {

        this.tripService.DeleteTrip(this.uid).subscribe(_ => {
            this.formGroup.markAsPristine();
            this.router.navigate(['/trips']);
        });
    }

    public onSubmit() {

        this.formGroup.markAllAsTouched();

        if (this.formGroup.valid) {

            const uid = this.uid;
            const name = this.name.value;
            const description = this.description.value;
            const participants = new Array<TripParticipantModel>();
            this.participants.value.forEach(p =>
                participants.push({ id: p.id, nick: p.nick })
            );

            const model: TripUpdateModel = { uid, name, description, participants };
            this.tripService.UpdateTrip(model).subscribe(_ => {
                this.router.navigate(['/trips', uid]);
            });
        }
    }

    public isDirty = () => this.formGroup.dirty;

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

            this.participants.setValidators([
                Validators.required,
                Validators.minLength(constants['ParticipantNameMinLength']),
                Validators.maxLength(constants['ParticipantNameMaxLength']),
            ]);

            this.tripNameMaxLength = constants['TripNameMaxLength'];
            this.tripDescriptionMaxLength = constants['TripDescriptionMaxLength'];
            this.participantNameMinLength = constants['ParticipantNameMinLength'];
            this.participantNameMaxLength = constants['ParticipantNameMaxLength'];
        });
    }
}
