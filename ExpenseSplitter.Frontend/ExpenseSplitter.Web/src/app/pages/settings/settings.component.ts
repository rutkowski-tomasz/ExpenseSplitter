import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, NgForm } from '@angular/forms';
import { UpdateUserModel } from 'src/app/models/user/update-user-model';
import { UserService } from 'src/app/services/user-service/user.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    @ViewChild('form', {static: false}) form: NgForm;

    public formGroup = new FormGroup({
        nick: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(40),
        ]),
    });

    public get nick(): AbstractControl {
        return this.formGroup.get('nick');
    }

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private router: Router,
    ) { }

    ngOnInit() {

        this.userService.userExtract.subscribe(userExtract => {
            this.nick.setValue(userExtract.nick);
        });
    }

    submit() {

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

    logOut() {
        this.authService.logOut();
    }
}
