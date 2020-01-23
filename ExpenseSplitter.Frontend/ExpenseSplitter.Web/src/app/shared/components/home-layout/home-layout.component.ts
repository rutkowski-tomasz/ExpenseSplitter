import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, useAnimation } from '@angular/animations';
import { moveFromLeft, moveFromRight, moveFromBottom, moveFromTop } from 'ngx-router-animations';

@Component({
    templateUrl: './home-layout.component.html',
    styleUrls: ['./home-layout.component.scss'],
    animations: [
        trigger('routeAnimations', [
            transition('tripsList => tripCreate', useAnimation(moveFromBottom)),
            transition('tripCreate => tripsList', useAnimation(moveFromTop)),
            transition('tripsList => tripJoin', useAnimation(moveFromBottom)),
            transition('tripJoin => tripsList', useAnimation(moveFromTop)),
            transition('tripsList => summary', useAnimation(moveFromRight)),
            transition('summary => tripsList', useAnimation(moveFromLeft)),
            transition('summary => expenseCreate', useAnimation(moveFromBottom)),
            transition('expenseCreate => summary', useAnimation(moveFromTop)),
            transition('tripsList => settings', useAnimation(moveFromTop)),
            transition('settings => tripsList', useAnimation(moveFromBottom)),
            transition('* => tripEdit', useAnimation(moveFromTop)),
            transition('tripEdit => *', useAnimation(moveFromBottom)),
            transition('summary => expenseDetails', useAnimation(moveFromRight)),
            transition('expenseDetails => summary', useAnimation(moveFromLeft)),
            transition('expenseDetails => expenseEdit', useAnimation(moveFromRight)),
            transition('expenseEdit => expenseDetails', useAnimation(moveFromLeft)),
            transition('summary => tripWhoAmI', useAnimation(moveFromTop)),
            transition('tripWhoAmI => summary', useAnimation(moveFromBottom)),
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
