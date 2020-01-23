import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';
import { TripAddActionEnum } from './trip-add-action.enum';

@Component({
    template: `
    <mat-nav-list>
        <a mat-list-item (click)="addTripAction($event, AddTripActionEnum.Join)">
            <span mat-line>Dołącz do rozliczenia</span>
        </a>

        <a mat-list-item (click)="addTripAction($event, AddTripActionEnum.Create)">
            <span mat-line>Nowe rozliczenie</span>
        </a>
    </mat-nav-list>
    `,
})
export class TripAddSheetComponent {

    public AddTripActionEnum = TripAddActionEnum;

    constructor(
        private matBottomSheetRef: MatBottomSheetRef<TripAddSheetComponent>
    ) { }

    public addTripAction($event: MouseEvent, action: TripAddActionEnum): void {
        this.matBottomSheetRef.dismiss(action);
        $event.preventDefault();
    }
}
