import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripAddSheetComponent } from './trip-add-sheet.component';
import { MatMenuModule, MatListModule, MatBottomSheetModule, MatDialogRef, MatBottomSheetRef } from '@angular/material';

describe('TripAddSheetComponent', () => {
    let component: TripAddSheetComponent;
    let fixture: ComponentFixture<TripAddSheetComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TripAddSheetComponent,
            ],
            imports: [
                MatMenuModule,
                MatListModule,
                MatBottomSheetModule,
            ],
            providers: [
                { provide: MatBottomSheetRef, useValue: {} },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TripAddSheetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
