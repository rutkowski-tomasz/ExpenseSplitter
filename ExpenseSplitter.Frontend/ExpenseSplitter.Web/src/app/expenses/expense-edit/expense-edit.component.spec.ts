import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseEditComponent } from './expense-edit.component';
import { appTesting } from 'src/app/app-testing';

describe('ExpenseEditComponent', () => {
    let component: ExpenseEditComponent;
    let fixture: ComponentFixture<ExpenseEditComponent>;

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExpenseEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
