import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'src/app/services/user-service/user.service';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {

    public formGroup: FormGroup = new FormGroup({
        email: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
    });

    public get email(): AbstractControl {
        return this.formGroup.get('email');
    }
    public get password(): AbstractControl {
        return this.formGroup.get('password');
    }

    private loginSubscription: Subscription;

    constructor(
        private router: Router,
        private authService: AuthService,
        private userService: UserService,
    ) { }
    
    public onSubmit() {
        if (this.formGroup.valid) {

            const email = this.email.value;
            const password = this.password.value;

            this.loginSubscription = this.authService.logIn(email, password).subscribe(
                _ => {
                    this.router.navigate(['/']);
                    this.userService.loadUserExtract();
                },
                (error: HttpErrorResponse) => {

                    if (error.status === 401) {
                        this.formGroup.setErrors({ invalidEmailOrPassword: true });
                    }
                }
            );
        }
    }

    public ngOnDestroy() {

        if (this.loginSubscription) {
            this.loginSubscription.unsubscribe();
        }
    }
}
