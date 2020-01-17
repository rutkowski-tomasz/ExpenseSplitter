import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, NgForm } from '@angular/forms';
import { UserUpdateModel } from 'src/app/models/user/user-update.model';
import { UserService } from 'src/app/services/user-service/user.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { ConfigService } from 'src/app/services/config-service/config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

    public formGroup = new FormGroup({
        nick: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(40),
        ]),
    });
    public isLoading = false;
    public isSubmitting = false;

    public participantNameMaxLength = 0;
    public get nick(): AbstractControl {
        return this.formGroup.get('nick');
    }

    private isNotDestroyed = new Subject();

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private router: Router,
        private configService: ConfigService,
    ) { }

    public ngOnInit() {

        this.isLoading = true;
        this.userService.userExtract
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe(userExtract => {

                if (userExtract.nick !== null) {
                    this.isLoading = false;
                }

                this.nick.setValue(userExtract.nick);
            });

        this.loadConfiguration();
    }

    public submit() {

        this.formGroup.markAllAsTouched();

        if (this.formGroup.valid && !this.isSubmitting) {

            this.isSubmitting = true;

            const nick = this.nick.value;

            const model: UserUpdateModel = { nick };
            this.userService.UpdateUser(model)
                .pipe(takeUntil(this.isNotDestroyed))
                .subscribe(
                    userExtract => {
                        this.userService.userExtract.next(userExtract);
                        this.router.navigate(['/trips']);
                    },
                    () => {},
                    () => {
                        this.isSubmitting = false;
                    }
                );
        }
    }

    public ngOnDestroy(): void {
        this.isNotDestroyed.next();
        this.isNotDestroyed.complete();
    }

    public logOut() {
        this.authService.logOut();
    }

    private loadConfiguration() {

        this.configService.GetConstants()
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe(constants => {

                this.nick.setValidators([
                    Validators.required,
                    Validators.minLength(constants['ParticipantNameMinLength']),
                    Validators.maxLength(constants['ParticipantNameMaxLength']),
                ])

                this.participantNameMaxLength = constants['ParticipantNameMaxLength'];
            });
    }
}
