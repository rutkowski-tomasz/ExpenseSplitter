import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, NgForm } from '@angular/forms';
import { TripService } from 'src/app/services/trip-service/trip.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    templateUrl: './trip-join.component.html',
    styleUrls: ['./trip-join.component.scss']
})
export class TripJoinComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('joinFrom', { static: false }) joinForm: NgForm;

    public formGroup = new FormGroup({
        uid: new FormControl('', [ Validators.required ]),
    });

    public get uid(): AbstractControl {
        return this.formGroup.get('uid');
    }

    public isSubmitting = false;

    private isNotDestroyed = new Subject();

    constructor(
        private activatedRoute: ActivatedRoute,
        private tripService: TripService,
        private router: Router,
    ) { }

    public ngOnInit() {
        this.activatedRoute.params
        .pipe(takeUntil(this.isNotDestroyed))
        .subscribe(params => {

            if (params.uid) {
                this.uid.setValue( params.uid );
            }
        });
    }

    public ngOnDestroy(): void {
        this.isNotDestroyed.next();
        this.isNotDestroyed.complete();
    }

    public ngAfterViewInit() {

        if (this.uid.value) {
            this.joinForm.ngSubmit.emit();
        }
    }

    public onSubmit() {

        this.formGroup.markAllAsTouched();

        if (this.formGroup.valid && !this.isSubmitting) {

            this.isSubmitting = true;

            let uid = this.uid.value;
            uid = uid.replace(/.+\/join\/([a-zA-Z0-9]+)$/, '$1');
            
            this.tripService.JoinTrip(uid)
                .pipe(takeUntil(this.isNotDestroyed))
                .subscribe(
                    _ => {
                        this.router.navigate(['/trips', uid, 'who-am-i']);
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
