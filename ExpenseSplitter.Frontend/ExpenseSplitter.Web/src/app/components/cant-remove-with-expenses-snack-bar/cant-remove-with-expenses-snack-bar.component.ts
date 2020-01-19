import { Component } from '@angular/core';

@Component({
    template: `
    <span>
        Nie można usunąć tego uczestnika, ponieważ bierze on udział w przynajmniej jednym wydatku 💸
    </span>
    `,
    styleUrls: []
})
export class CantRemoveParticipantWithExpensesSnackBarComponent {

    constructor() { }
}
