import { Component, Input } from '@angular/core';
import { PageErrorEnum } from './page-error.enum';

@Component({
    selector: 'es-page-error',
    templateUrl: './page-error.component.html',
    styleUrls: ['./page-error.component.scss']
})
export class PageErrorComponent {

    @Input() error: PageErrorEnum;

    public PageErrorEnum = PageErrorEnum;

    constructor() { }
}
