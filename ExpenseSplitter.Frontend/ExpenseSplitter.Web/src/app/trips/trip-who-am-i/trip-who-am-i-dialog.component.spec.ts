import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripWhoAmIDialogComponent } from './trip-who-am-i-dialog.component';
import { appTesting } from 'src/app/app-testing';

describe('TripWhoAmIDialogComponent', () => {
    let component: TripWhoAmIDialogComponent;
    let fixture: ComponentFixture<TripWhoAmIDialogComponent>;

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TripWhoAmIDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
