import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, NgForm } from '@angular/forms';
import { UpdateUserModel } from 'src/app/models/user/update-user-model';
import { UserService } from 'src/app/services/user-service/user.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { ConfigService } from 'src/app/services/config-service/config.service';

@Component({
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    public formGroup = new FormGroup({
        nick: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(40),
        ]),
    });
    public isLoading = false;

    public participantNameMaxLength = 0;
    public get nick(): AbstractControl {
        return this.formGroup.get('nick');
    }

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private router: Router,
        private configService: ConfigService,
    ) { }

    public ngOnInit() {

        this.isLoading = true;
        this.userService.userExtract.subscribe(userExtract => {

            if (userExtract.nick !== null) {
                this.isLoading = false;
            }

            this.nick.setValue(userExtract.nick);
        });

        this.loadConfiguration();
    }

    public submit() {

        this.formGroup.markAllAsTouched();

        if (this.formGroup.valid) {

            const nick = this.nick.value;

            const model: UpdateUserModel = { nick };
            this.userService.UpdateUser(model).subscribe(userExtract => {
                this.userService.userExtract.next(userExtract);
                this.router.navigate(['/trips']);
            });
        }
    }

    public logOut() {
        this.authService.logOut();
    }

    private loadConfiguration() {

        this.configService.GetConstants().subscribe(constants => {

            this.nick.setValidators([
                Validators.required,
                Validators.minLength(constants['ParticipantNameMinLength']),
                Validators.maxLength(constants['ParticipantNameMaxLength']),
            ])

            this.participantNameMaxLength = constants['ParticipantNameMaxLength'];
        });
    }
}
