import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, useAnimation } from '@angular/animations';
import { moveFromLeft, moveFromRight, moveFromBottom, moveFromTop } from 'ngx-router-animations';

@Component({
    selector: 'app-home-layout',
    templateUrl: './home-layout.component.html',
    styleUrls: ['./home-layout.component.scss'],
    animations: [
        trigger('routeAnimations', [
            transition('tripsList => tripCreate', useAnimation(moveFromBottom)),
            transition('tripCreate => tripsList', useAnimation(moveFromTop)),
            transition('tripsList => trip', useAnimation(moveFromRight)),
            transition('trip => tripsList', useAnimation(moveFromLeft)),
            transition('trip => expenseCreate', useAnimation(moveFromBottom)),
            transition('expenseCreate => trip', useAnimation(moveFromTop)),
        ])
    ]
})
export class HomeLayoutComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

    getState(outlet: RouterOutlet) {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData.state;
    }
}
