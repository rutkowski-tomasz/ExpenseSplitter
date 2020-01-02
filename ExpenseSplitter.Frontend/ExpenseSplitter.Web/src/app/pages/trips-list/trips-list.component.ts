import { Component, OnInit } from '@angular/core';
import { TripService } from 'src/app/services/trip-service/trip.service';
import { Trip } from 'src/app/data/trip';

@Component({
    templateUrl: './trips-list.component.html',
    styleUrls: ['./trips-list.component.scss']
})
export class TripsListComponent implements OnInit {

    public trips: Trip[];
    public shareUrl = window.location.origin;

    constructor(
        private tripService: TripService,
    ) { }

    ngOnInit() {
        this.tripService.GetTrips().subscribe(data => {
            this.trips = data;
        });
    }
}
