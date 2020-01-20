import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { TripService } from 'src/app/trips/trip-service/trip.service';
import { ActivatedRoute, Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { MatTabGroup, MatTabChangeEvent } from '@angular/material';
import { trigger, transition, useAnimation } from '@angular/animations';
import { moveFromLeft, moveFromRight } from "ngx-router-animations";
import { TripDetailsModel } from 'src/app/models/trip/trip-details.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from 'src/app/auth/user-service/user.service';
import { AppConfig } from 'src/app/shared/app.config';

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
    public detailedCalculations: boolean;
    public isExpenseListView: boolean;

    @ViewChild('matTabGroup', { static: false }) matTabGroup: MatTabGroup;
    public selectedIndex = 0;

    private isNotDestroyed = new Subject();

    constructor(
        private tripService: TripService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef,
        private userService: UserService,
        private appConfig: AppConfig,
    ) { }

    public ngOnInit() {

        this.detailedCalculations = this.userService.getPreference(this.appConfig.detailedCalculations);

        this.activatedRoute.params
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe(params => {

                this.uid = params.uid;
                this.tripService.GetTrip(this.uid)
                    .pipe(takeUntil(this.isNotDestroyed))
                    .subscribe(data => {

                        this.trip = data;
                        this.buildParticipantsHeader(data);

                        this.shareUrl = `${window.location.origin}/trips/join/${this.trip.uid}`;
                    });
            });

        this.updateIsExpenseListView(this.router.url);

        this.router.events
            .pipe(takeUntil(this.isNotDestroyed))
            .subscribe((val) => {
                if (!(val instanceof NavigationEnd)) {
                    return;
                }

                this.updateIsExpenseListView(val.url);
            });
    }

    private updateIsExpenseListView(url: string): void {
        this.isExpenseListView = !url.endsWith('balance');
    }

    public ngOnDestroy(): void {
        this.isNotDestroyed.next();
        this.isNotDestroyed.complete();
    }

    public ngAfterViewInit(): void {
        this.updateSelectedTab();
    }

    public toggleDetailedCalculations() {
        this.detailedCalculations = !this.detailedCalculations;
        this.userService.setPreference(this.appConfig.detailedCalculations, this.detailedCalculations);
    }

    public tabClicked($event: MatTabChangeEvent) {
        this.router.navigate([$event.tab.textLabel.link], { relativeTo: this.activatedRoute });
    }

    public getState(outlet: RouterOutlet) {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData.state;
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

    private updateSelectedTab() {

        const tabs = this.matTabGroup._tabs;

        tabs.forEach((tab, i) => {

            const tabData = tab.textLabel as any;

            if (this.router.url === tabData.link) {
                this.selectedIndex = i;
                this.changeDetectorRef.detectChanges();
            }
        });
    }
}