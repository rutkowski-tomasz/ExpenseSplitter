import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseDetailsComponent } from './expense-details.component';
import { appTesting } from 'src/app/app-testing';

describe('ExpenseDetailsComponent', () => {
    let component: ExpenseDetailsComponent;
    let fixture: ComponentFixture<ExpenseDetailsComponent>;

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExpenseDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
