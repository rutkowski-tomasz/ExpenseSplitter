import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseCreateComponent } from './expense-create.component';
import { appTesting } from 'src/app/app-testing';

describe('ExpenseCreateComponent', () => {
    let component: ExpenseCreateComponent;
    let fixture: ComponentFixture<ExpenseCreateComponent>;

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExpenseCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
