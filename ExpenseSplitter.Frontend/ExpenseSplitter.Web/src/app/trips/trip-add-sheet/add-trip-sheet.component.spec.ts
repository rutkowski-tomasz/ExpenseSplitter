import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripAddSheetComponent } from './add-trip-sheet.component';
import { appTesting } from 'src/app/app-testing';

describe('TripAddSheetComponent', () => {
    let component: TripAddSheetComponent;
    let fixture: ComponentFixture<TripAddSheetComponent>;

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
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
