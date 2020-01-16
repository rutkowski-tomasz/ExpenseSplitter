import { Component, OnInit } from '@angular/core';
import { IsAliveService } from './services/is-alive-service/is-alive.service';
import { PageErrorEnum } from './shared/page-error/page-error.enum';

@Component({
    selector: 'es-root',
    template: `
        <router-outlet></router-outlet>
        <es-page-error [error]="error"></es-page-error>
    `,
    styleUrls: []
})
export class AppComponent implements OnInit {

    public error: PageErrorEnum = null;

    constructor(
        private isAliveService: IsAliveService
    ) { }

    public ngOnInit() {
        this.isAliveService.serverIsAlive.subscribe(isAlive => {
            if (!isAlive) {
                this.error = PageErrorEnum.SERVERDOWN;
            }
        });
    }
}
