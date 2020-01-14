import { Component } from '@angular/core';

@Component({
    template: `
        <h1 mat-dialog-title>Odrzucić zmiany?</h1>
        <div mat-dialog-actions>
            <button mat-button [mat-dialog-close]="false">Anuluj</button>
            <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Odrzuć</button>
        </div>
    `,
})
export class DiscardDialog {

    constructor() { }
}
