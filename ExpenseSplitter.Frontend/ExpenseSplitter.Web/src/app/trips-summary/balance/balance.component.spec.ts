import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceComponent } from './balance.component';
import { appTesting } from 'src/app/app-testing';

describe('BalanceComponent', () => {
    let component: BalanceComponent;
    let fixture: ComponentFixture<BalanceComponent>;

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BalanceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
