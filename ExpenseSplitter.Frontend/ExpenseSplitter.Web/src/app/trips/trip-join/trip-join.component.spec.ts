import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripJoinComponent } from './trip-join.component';
import { appTesting } from 'src/app/app-testing';

describe('TripJoinComponent', () => {
    let component: TripJoinComponent;
    let fixture: ComponentFixture<TripJoinComponent>;

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TripJoinComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
