import { Component, OnInit, OnDestroy } from '@angular/core';
import { TripService } from 'src/app/services/trip-service/trip.service';
import { MatBottomSheet } from '@angular/material';
import { Router } from '@angular/router';
import { TripListModel } from 'src/app/models/trip/trip-list.model';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { TripAddSheetComponent } from '../trip-add-sheet/add-trip-sheet.component';
import { TripAddActionEnum } from '../trip-add-sheet/trip-add-action.enum';

@Component({
    templateUrl: './trip-list.component.html',
    styleUrls: ['./trip-list.component.scss']
})
export class TripListComponent implements OnInit, OnDestroy {

    public trips: TripListModel[];
    public shareUrl = window.location.origin;
    public lastUpdatedTripUid: string;

    private isNotDestroyed = new Subject();

    constructor(
        private tripService: TripService,
        private matBottomSheet: MatBottomSheet,
        private router: Router,
    ) { }

    public ngOnInit() {
        this.tripService.GetTrips()
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe(data => {
                this.trips = data;
            });

        this.tripService.lastUpdatedTripUid
            .pipe(
                takeUntil(this.isNotDestroyed),
                filter(x => x !== null)
            )
            .subscribe(uid => {
                this.lastUpdatedTripUid = uid;
                this.tripService.lastUpdatedTripUid.next(null);
            });
    }

    public ngOnDestroy(): void {
        this.isNotDestroyed.next();
        this.isNotDestroyed.complete();
    }

    public addNewTrip() {
        const bottomSheetRef = this.matBottomSheet.open(TripAddSheetComponent);

        bottomSheetRef.afterDismissed()
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe((result: TripAddActionEnum) => {

                if (result === TripAddActionEnum.Join) {
                    this.router.navigate(['/trips', 'join']);
                } else if(result === TripAddActionEnum.Create) {
                    this.router.navigate(['/trips', 'new']);
                }
            });
    }
}
