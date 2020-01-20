import { Component, OnInit } from '@angular/core';
import { PageErrorEnum } from './shared/components/page-error/page-error.enum';
import { IsAliveService } from './shared/services/is-alive-service/is-alive.service';

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
