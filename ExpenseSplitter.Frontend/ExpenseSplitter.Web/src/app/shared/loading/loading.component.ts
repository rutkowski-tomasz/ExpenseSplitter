import { Component } from '@angular/core';

@Component({
    selector: 'es-loading',
    template: `
        <div class="background">
            <div class="loading-container">
                <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
        </div>
    `,
    styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {

    constructor() { }
}
