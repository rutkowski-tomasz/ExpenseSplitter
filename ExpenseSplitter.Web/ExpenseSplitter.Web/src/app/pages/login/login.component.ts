import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public invalidEmailOrPassword = false;
    public form: FormGroup = new FormGroup({
        email: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
    });

    constructor(
        private router: Router,
        private authService: AuthService,
        private userService: UserService,
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    ngOnInit() {
    }

    submit() {
        if (this.form.valid) {
            this.invalidEmailOrPassword = false;
            this.authService.logIn(this.form.controls.email.value, this.form.controls.password.value).subscribe(
                _ => {
                    this.router.navigate(['/']);
                    this.userService.loadUserExtract();
                },
                (httpErrorResponse: HttpErrorResponse) => {

                    if (httpErrorResponse.status === 401) {
                        this.invalidEmailOrPassword = true;
                        this.changeDetectorRef.detectChanges();
                    }
                }
            );
        }
    }
}
