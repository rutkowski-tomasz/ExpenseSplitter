import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config-service/config.service';
import { Validators, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user-service/user.service';
import { Subject } from 'rxjs';
import { takeUntil, filter, take } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material';

@Component({
    template: `
        <h1 mat-dialog-title>Podaj swój nick</h1>
        <div mat-dialog-content>
            <mat-form-field>
                <input
                    type="text"
                    matInput
                    placeholder="Nick"
                    [formControl]="nick"
                />
                <mat-hint align="end" *ngIf="participantNameMaxLength">{{ nick.value?.length || 0 }}/{{ participantNameMaxLength }}</mat-hint>
                <mat-error *ngIf="nick.invalid && nick.errors.required">
                    Wprowadź nick
                </mat-error>
                <mat-error *ngIf="nick.invalid && nick.errors.minlength">
                    Za krótki nick, dopisz jeszcze {{ nick.errors.minlength.requiredLength - nick.errors.minlength.actualLength }} znaków
                </mat-error>
                <mat-error *ngIf="nick.invalid && nick.errors.maxlength">
                    Za długi nick, usuń jeszcze {{ nick.errors.maxlength.actualLength - nick.errors.maxlength.requiredLength }} znaków
                </mat-error>
            </mat-form-field>
        </div>

        <div mat-dialog-actions>
            <button mat-button [mat-dialog-close]="null">Anuluj</button>
            <button mat-button (click)="confirmNick()" cdkFocusInitial>Potwierdź</button>
        </div>
    `,
})
export class TripWhoAmIDialogComponent implements OnInit {

    public participantNameMaxLength = 0;
    public nick = new FormControl('', [
        Validators.required,
    ]);

    private isNotDestroyed = new Subject();

    constructor(
        private configService: ConfigService,
        private userService: UserService,
        private matDialogRef: MatDialogRef<TripWhoAmIDialogComponent>,
    ) { }

    public ngOnInit(): void {
        this.loadConfiguration();
        
        this.userService.userExtract
            .pipe(takeUntil(this.isNotDestroyed), filter(x => x.id !== null), take(1))
            .subscribe(userExtract => {
                this.nick.setValue(userExtract.nick);
            });
    }

    public ngOnDestroy(): void {
        this.isNotDestroyed.next();
        this.isNotDestroyed.complete();
    }

    public confirmNick(): void {

        if (!this.nick.valid) {
            return;
        }

        this.matDialogRef.close(this.nick.value);
    }

    private loadConfiguration() {

        this.configService.GetConstants().subscribe(constants => {

            this.nick.setValidators([
                Validators.required,
                Validators.minLength(constants['ParticipantNameMinLength']),
                Validators.maxLength(constants['ParticipantNameMaxLength']),
            ]);

            this.participantNameMaxLength = constants['ParticipantNameMaxLength'];
        });
    }
}
