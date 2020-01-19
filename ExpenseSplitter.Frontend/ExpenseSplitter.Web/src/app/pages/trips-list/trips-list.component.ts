import { Component, OnInit, OnDestroy } from '@angular/core';
import { TripService } from 'src/app/services/trip-service/trip.service';
import { MatBottomSheet } from '@angular/material';
import { AddTripSheetComponent } from 'src/app/components/add-trip/add-trip-sheet.component';
import { AddTripActionEnum } from 'src/app/components/add-trip/add-trip-action.enum';
import { Router } from '@angular/router';
import { TripListModel } from 'src/app/models/trip/trip-list.model';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
    templateUrl: './trips-list.component.html',
    styleUrls: ['./trips-list.component.scss']
})
export class TripsListComponent implements OnInit, OnDestroy {

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
        const bottomSheetRef = this.matBottomSheet.open(AddTripSheetComponent);

        bottomSheetRef.afterDismissed()
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe((result: AddTripActionEnum) => {

                if (result === AddTripActionEnum.JOIN) {
                    this.router.navigate(['/join']);
                } else if(result === AddTripActionEnum.CREATE) {
                    this.router.navigate(['/trips', 'new']);
                }
            });
    }
}
