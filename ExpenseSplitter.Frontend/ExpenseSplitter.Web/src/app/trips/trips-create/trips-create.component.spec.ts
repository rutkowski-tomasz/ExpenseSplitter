import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsCreateComponent } from './trips-create.component';
import { appTesting } from 'src/app/app-testing';

describe('TripsCreateComponent', () => {
    let component: TripsCreateComponent;
    let fixture: ComponentFixture<TripsCreateComponent>;

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TripsCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
