import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTypeComponent } from './expense-type.component';
import { appTesting } from 'src/app/app-testing';

describe('ExpenseTypeComponent', () => {
    let component: ExpenseTypeComponent;
    let fixture: ComponentFixture<ExpenseTypeComponent>;

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExpenseTypeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
