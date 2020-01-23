import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryExpenseListFooterComponent } from './summary-expense-list-footer.component';
import { appTesting } from 'src/app/app-testing';

describe('SummaryExpenseListFooterComponent', () => {
    let component: SummaryExpenseListFooterComponent;
    let fixture: ComponentFixture<SummaryExpenseListFooterComponent>;

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SummaryExpenseListFooterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
