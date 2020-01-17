import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { TripService } from 'src/app/services/trip-service/trip.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MatTabGroup, MatTabChangeEvent } from '@angular/material';
import { trigger, transition, useAnimation } from '@angular/animations';
import { moveFromLeft, moveFromRight } from "ngx-router-animations";
import { TripDetailsModel } from 'src/app/models/trip/trip-details.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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

export class TripComponent implements OnInit, OnDestroy, AfterViewInit {

    public trip: TripDetailsModel;
    public participants = '';
    public otherParticipantsCount = 0;
    public shareUrl = '';
    public uid: string;

    @ViewChild('matTabGroup', { static: false }) matTabGroup: MatTabGroup;
    public selectedIndex = 0;

    private isNotDestroyed = new Subject();

    constructor(
        private tripService: TripService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    public ngOnInit() {
        this.activatedRoute.params
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe(params => {

                this.uid = params.uid;
                this.tripService.GetTrip(this.uid)
                    .pipe(takeUntil(this.isNotDestroyed))
                    .subscribe(data => {

                        this.trip = data;
                        this.buildParticipantsHeader(data);

                        this.shareUrl = `${window.location.origin}/join/${this.trip.uid}`;
                    });
            });
    }

    public ngOnDestroy(): void {
        this.isNotDestroyed.next();
        this.isNotDestroyed.complete();
    }

    private buildParticipantsHeader(trip: TripDetailsModel) {

        for (let i = 0; i < trip.participants.length; i++) {

            const left = trip.participants.length - 1 - i;
            if (this.participants.length + trip.participants[i].nick.length > 26 && left > 1) {
                this.otherParticipantsCount = left;
                break;
            }

            this.participants += trip.participants[i].nick + ', ';  
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