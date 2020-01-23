import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTypeComponent } from './expense-type.component';

describe('ExpenseTypeComponent', () => {
    let component: ExpenseTypeComponent;
    let fixture: ComponentFixture<ExpenseTypeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ExpenseTypeComponent]
        })
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
