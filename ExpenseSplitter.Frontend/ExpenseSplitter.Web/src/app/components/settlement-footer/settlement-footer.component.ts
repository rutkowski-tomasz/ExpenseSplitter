import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'es-settlement-footer',
    templateUrl: './settlement-footer.component.html',
    styleUrls: ['./settlement-footer.component.scss']
})
export class SettlementFooterComponent implements OnInit {

    @Input() uid: string;
    @Input() myCost: number;
    @Input() totalCost: number;

    constructor() { }

    ngOnInit() {
    }
}
