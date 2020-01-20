import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripWhoAmIComponent } from './trip-who-am-i.component';
import { appTesting } from 'src/app/app-testing';

describe('TripWhoAmIComponent', () => {
    let component: TripWhoAmIComponent;
    let fixture: ComponentFixture<TripWhoAmIComponent>;

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TripWhoAmIComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
