import { Component, OnInit } from '@angular/core';
import { TripService } from 'src/app/services/trip-service/trip.service';
import { Trip } from 'src/app/data/trip';
import { MatBottomSheet } from '@angular/material';
import { AddTripSheetComponent } from 'src/app/components/add-trip/add-trip-sheet.component';
import { AddTripActionEnum } from 'src/app/components/add-trip/add-trip-action.enum';
import { Router } from '@angular/router';

@Component({
    templateUrl: './trips-list.component.html',
    styleUrls: ['./trips-list.component.scss']
})
export class TripsListComponent implements OnInit {

    public trips: Trip[];
    public shareUrl = window.location.origin;

    constructor(
        private tripService: TripService,
        private matBottomSheet: MatBottomSheet,
        private router: Router,
    ) { }

    public ngOnInit() {
        this.tripService.GetTrips().subscribe(data => {
            this.trips = data;
        });
    }

    public addNewTrip() {
        const bottomSheetRef = this.matBottomSheet.open(AddTripSheetComponent);

        bottomSheetRef.afterDismissed().subscribe((result: AddTripActionEnum) => {

            if (result === AddTripActionEnum.JOIN) {
                this.router.navigate(['/join']);
            } else if(result === AddTripActionEnum.CREATE) {
                this.router.navigate(['/trips', 'new']);
            }
        });
    }
}
