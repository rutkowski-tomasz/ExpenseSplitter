import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    public formGroup: FormGroup = new FormGroup({
        email: new FormControl('', [Validators.email, Validators.required]),
        password: new FormControl('', [Validators.required]),
        repassword: new FormControl('', [Validators.required, this.matchingPasswords()]),
        nick: new FormControl('', [Validators.required]),
    });

    public get email(): AbstractControl {
        return this.formGroup.get('email');
    }
    public get password(): AbstractControl {
        return this.formGroup.get('password');
    }
    public get repassword(): AbstractControl {
        return this.formGroup.get('repassword');
    }
    public get nick(): AbstractControl {
        return this.formGroup.get('nick');
    }

    constructor(
        private router: Router,
        private authService: AuthService,
        private userService: UserService,
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    public ngOnInit() {
    }

    public onSubmit() {
        if (this.formGroup.valid) {

            const email = this.email.value;
            const password = this.password.value;
            const nick = this.nick.value;

            this.authService.Register(email, password, nick).subscribe(
                _ => {
                    this.router.navigate(['/']);
                    this.userService.loadUserExtract();
                },
                (httpErrorResponse: HttpErrorResponse) => {

                    if (httpErrorResponse.status === 422) {
                        this.email.setErrors({ taken: true });
                    }
                }
            );
        }
    }

    public matchingPasswords(): (AbstractControl) => ValidationErrors | null {
        return (control: AbstractControl): ValidationErrors | null => {
            return !!control.parent && !!control.parent.value && control.value === control.parent.controls['password'].value
                ? null
                : { mismatch: true };
        };
    }
}
