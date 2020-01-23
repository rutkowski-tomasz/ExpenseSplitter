import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from 'src/app/services/config-service/config.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth-service/auth.service';
import { UserService } from '../../services/user-service/user.service';

@Component({
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

    public formGroup: FormGroup = new FormGroup({
        email: new FormControl('', [Validators.email, Validators.required]),
        password: new FormControl('', [Validators.required]),
        repassword: new FormControl('', [Validators.required]),
        nick: new FormControl('', [Validators.required]),
    }, [this.matchingPasswords()]);

    public userEmailMaxLength = 0;
    public get email(): AbstractControl {
        return this.formGroup.get('email');
    }
    public get password(): AbstractControl {
        return this.formGroup.get('password');
    }
    public get repassword(): AbstractControl {
        return this.formGroup.get('repassword');
    }
    public participantNameMaxLength = 0;
    public get nick(): AbstractControl {
        return this.formGroup.get('nick');
    }

    private registerSubscription: Subscription;

    constructor(
        private router: Router,
        private authService: AuthService,
        private userService: UserService,
        private configService: ConfigService,
    ) { }

    public ngOnInit() {
        this.loadConfiguration();
    }

    public onSubmit() {
        if (this.formGroup.valid) {

            const email = this.email.value;
            const password = this.password.value;
            const nick = this.nick.value;

            this.registerSubscription = this.authService.Register(email, password, nick).subscribe(
                _ => {
                    this.router.navigate(['/']);
                    this.userService.loadUserExtract();
                },
                (error: HttpErrorResponse) => {

                    if (error.status === 409) {
                        this.email.setErrors({ taken: true });
                    }
                }
            );
        }
    }

    public matchingPasswords(): ValidatorFn {

        return (formGroup: AbstractControl): {[key: string]: any} | null => {
            const password = formGroup.get('password').value;
            const repassword = formGroup.get('repassword').value;
    
            if (password !== repassword) {
                this.repassword.setErrors({ mismatch: true });
            }
    
            return null;
        };
    }


    public ngOnDestroy() {

        if (this.registerSubscription) {
            this.registerSubscription.unsubscribe();
        }
    }

    private loadConfiguration() {

        this.configService.GetConstants().subscribe(constants => {

            this.email.setValidators([
                Validators.required,
                Validators.maxLength(constants.UserEmailMaxLength),
                Validators.email,
            ]);

            this.nick.setValidators([
                Validators.required,
                Validators.minLength(constants.ParticipantNameMinLength),
                Validators.maxLength(constants.ParticipantNameMaxLength),
            ]);

            this.userEmailMaxLength = constants.UserEmailMaxLength;
            this.participantNameMaxLength = constants.ParticipantNameMaxLength;
        });
    }
}
