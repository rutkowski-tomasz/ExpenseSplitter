import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'es-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    @Input() backText: string;
    @Input() backLink: string[];

    constructor() { }

    ngOnInit() {
    }
}
