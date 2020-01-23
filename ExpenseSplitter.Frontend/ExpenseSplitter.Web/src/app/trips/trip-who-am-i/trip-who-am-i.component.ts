import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, filter, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TripService } from 'src/app/services/trip-service/trip.service';
import { ParticipantModel } from 'src/app/models/participant/participant.model';
import { UserService } from 'src/app/services/user-service/user.service';
import { UserModel } from 'src/app/models/user/user.model';
import { ConfirmDiscardChanges } from 'src/app/shared/components/discard-dialog/confirm-discard-changes.interface';
import { MatDialog } from '@angular/material';
import { TripWhoAmIDialogComponent } from './trip-who-am-i-dialog.component';

@Component({
    templateUrl: './trip-who-am-i.component.html',
    styleUrls: ['./trip-who-am-i.component.scss']
})
export class TripWhoAmIComponent implements OnInit, OnDestroy, ConfirmDiscardChanges {

    public uid: string;
    public participants: ParticipantModel[];
    public user: UserModel;

    public myParticipantId: number;
    public chosenParticipantId: number;
    public isSubmitting = false;

    private isNotDestroyed = new Subject();

    constructor(
        private activatedRoute: ActivatedRoute,
        private tripService: TripService,
        private userService: UserService,
        private router: Router,
        private matDialog: MatDialog,
    ) { }

    public ngOnInit() {

        this.userService.userExtract
            .pipe(
                filter(x => x.id !== null),
                takeUntil(this.isNotDestroyed),
                take(1)
            )
            .subscribe(user => {
                this.user = user;
                this.prepareParticipantSelection();
            });

        this.activatedRoute.params
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe(params => {

                this.uid = params.uid;
                this.tripService.GetParticipants(this.uid)
                    .pipe(takeUntil(this.isNotDestroyed))
                    .subscribe(data => {
                        this.participants = data;
                        this.prepareParticipantSelection();
                    });
            });
    }

    public ngOnDestroy(): void {
        this.isNotDestroyed.next();
        this.isNotDestroyed.complete();
    }

    public onSubmit(): void {

        this.isSubmitting = true;

        this.tripService
            .SetWhoAmI(this.uid, this.chosenParticipantId)
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe(_ => {
                this.isSubmitting = false;

                this.myParticipantId = this.chosenParticipantId;
                this.router.navigate(['/trips', this.uid, 'summary']);
            });
    }

    public isDirty = () => this.chosenParticipantId !== this.myParticipantId;

    public addNewParticipant() {
        
        const dialogRef = this.matDialog.open(TripWhoAmIDialogComponent);
        return dialogRef.afterClosed().subscribe(nick => {

            this.isSubmitting = true;

            this.tripService
                .CreateWhoAmI(this.uid, nick)
                .pipe(takeUntil(this.isNotDestroyed))
                .subscribe(_ => {
                    this.isSubmitting = false;
    
                    this.myParticipantId = this.chosenParticipantId;
                    this.router.navigate(['/trips', this.uid, 'summary']);
                });
        });
    }

    private prepareParticipantSelection() {

        if (!this.user || !this.participants) {
            return;
        }

        const userId = this.user.id;
        const participant = this.participants.find(x => x.claimedUserIds.some(y => y === userId));

        this.chosenParticipantId = participant ? participant.id : null;
        this.myParticipantId = this.chosenParticipantId;
    }
}
