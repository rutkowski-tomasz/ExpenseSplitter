import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsListComponent } from './trips-list.component';
import { appTesting } from 'src/app/app-testing';

describe('TripsListComponent', () => {
    let component: TripsListComponent;
    let fixture: ComponentFixture<TripsListComponent>;

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TripsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});