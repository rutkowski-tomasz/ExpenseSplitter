import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTripSheetComponent } from './add-trip-sheet.component';
import { appTesting } from 'src/app/app-testing';

describe('AddTripComponent', () => {
    let component: AddTripSheetComponent;
    let fixture: ComponentFixture<AddTripSheetComponent>;

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddTripSheetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
