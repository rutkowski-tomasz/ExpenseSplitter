import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { TripService } from 'src/app/services/trip-service/trip.service';
import { Trip } from 'src/app/data/trip';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MatTabGroup, MatTabChangeEvent } from '@angular/material';
import { trigger, transition, useAnimation } from '@angular/animations';
import { moveFromLeft, moveFromRight, moveFromTop, moveFromBottom } from "ngx-router-animations";

@Component({
    templateUrl: './trip.component.html',
    styleUrls: ['./trip.component.scss'],
    animations: [
        trigger('routeAnimations', [
            transition('expenses => balance', useAnimation(moveFromRight)),
            transition('balance => expenses', useAnimation(moveFromLeft)),
        ])
    ]
})

export class TripComponent implements OnInit, AfterViewInit {

    public trip: Trip;
    public participants = '';
    public otherParticipantsCount = 0;
    public shareUrl = '';

    @ViewChild('matTabGroup', { static: false }) matTabGroup: MatTabGroup;
    public selectedIndex = 0;

    constructor(
        private tripService: TripService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            const uid = params.uid;
            this.tripService.GetTrip(uid).subscribe(data => {
                this.trip = data;
                this.buildParticipantsHeader(data);

                this.shareUrl = `${window.location.origin}/join/${this.trip.uid}`;
            });
        });
    }

    private buildParticipantsHeader(trip: Trip) {

        for (let i = 0; i < trip.participants.length; i++) {

            const left = trip.participants.length - 1 - i;
            if (this.participants.length + trip.participants[i].name.length > 36 && left > 1) {
                this.otherParticipantsCount = left;
                break;
            }

            this.participants += trip.participants[i].name + ', ';  
        }

        this.participants = this.participants.substr(0, this.participants.length - 2);
    }

    ngAfterViewInit(): void {
        this.updateSelectedTab();
    }

    updateSelectedTab() {

        const tabs = this.matTabGroup._tabs;

        tabs.forEach((tab, i) => {

            const tabData = tab.textLabel as any;

            if (this.router.url === tabData.link) {
                this.selectedIndex = i;
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    tabClicked($event: MatTabChangeEvent) {
        this.router.navigate([$event.tab.textLabel.link], { relativeTo: this.activatedRoute });
    }

    getState(outlet: RouterOutlet) {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData.state;
    }
}