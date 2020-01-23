import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryExpenseListComponent } from './summary-expense-list.component';
import { appTesting } from 'src/app/app-testing';

describe('SummaryExpenseListComponent', () => {
    let component: SummaryExpenseListComponent;
    let fixture: ComponentFixture<SummaryExpenseListComponent>;

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SummaryExpenseListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
