import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, NgForm } from '@angular/forms';
import { TripService } from 'src/app/services/trip-service/trip.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    templateUrl: './trip-join.component.html',
    styleUrls: ['./trip-join.component.scss']
})
export class TripJoinComponent implements OnInit, AfterViewInit {

    @ViewChild('joinFrom', { static: false }) joinForm: NgForm;

    public formGroup = new FormGroup({
        uid: new FormControl('', [ Validators.required ]),
    });

    public get uid(): AbstractControl {
        return this.formGroup.get('uid');
    }

    public isSubmitting = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private tripService: TripService,
        private router: Router,
    ) { }

    public ngOnInit() {
        this.activatedRoute.params.subscribe(params => {

            if (params.uid) {
                this.uid.setValue( params.uid );
            }
        });
    }

    public ngAfterViewInit() {

        if (this.uid.value) {
            this.joinForm.ngSubmit.emit();
        }
    }

    public submit() {

        this.formGroup.markAllAsTouched();

        if (this.formGroup.valid && !this.isSubmitting) {

            this.isSubmitting = true;

            let uid = this.uid.value;
            uid = uid.replace(/.+\/join\/([a-zA-Z0-9]+)$/, '$1');
            
            this.tripService.JoinTrip(uid).subscribe(
                _ => {
                    this.router.navigate(['/trips', uid]);
                },
                (error: HttpErrorResponse) => {

                    if (error.status === 429) {
                        this.uid.setErrors({ tooManyRequests: true });
                    }
                    else if (error.status === 404) {
                        this.uid.setErrors({ uidInvalid: true });
                    }
                },
                () => {
                    this.isSubmitting = false;
                }
            );
        }
    }
}
