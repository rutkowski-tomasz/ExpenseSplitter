import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryBalanceComponent } from './summary-balance.component';
import { appTesting } from 'src/app/app-testing';

describe('SummaryBalanceComponent', () => {
    let component: SummaryBalanceComponent;
    let fixture: ComponentFixture<SummaryBalanceComponent>;

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SummaryBalanceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
