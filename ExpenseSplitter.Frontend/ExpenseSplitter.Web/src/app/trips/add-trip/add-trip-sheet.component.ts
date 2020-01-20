import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';
import { AddTripActionEnum } from './add-trip-action.enum';

@Component({
    template: `
    <mat-nav-list>
        <a mat-list-item (click)="addTripAction($event, AddTripActionEnum.JOIN)">
            <span mat-line>Dołącz do rozliczenia</span>
        </a>

        <a mat-list-item (click)="addTripAction($event, AddTripActionEnum.CREATE)">
            <span mat-line>Nowe rozliczenie</span>
        </a>
    </mat-nav-list>
    `,
})
export class AddTripSheetComponent {

    public AddTripActionEnum = AddTripActionEnum;

    constructor(
        private matBottomSheetRef: MatBottomSheetRef<AddTripSheetComponent>
    ) { }

    public addTripAction($event: MouseEvent, action: AddTripActionEnum): void {
        this.matBottomSheetRef.dismiss(action);
        $event.preventDefault();
    }
}
