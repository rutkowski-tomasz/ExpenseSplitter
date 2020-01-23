import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseEditComponent } from './expense-edit.component';
import {
    MatFormFieldModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatIconModule,
    MatNativeDateModule,
    MatInputModule
} from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExpenseTypeComponent } from '../expense-type/expense-type.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ExpenseEditComponent', () => {
    let component: ExpenseEditComponent;
    let fixture: ComponentFixture<ExpenseEditComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ExpenseEditComponent,
                ExpenseTypeComponent,
            ],
            imports: [
                SharedModule,
                RouterTestingModule,
                HttpClientTestingModule,
                ReactiveFormsModule,
                NoopAnimationsModule,
                MatFormFieldModule,
                MatInputModule,
                MatDatepickerModule,
                MatAutocompleteModule,
                MatCheckboxModule,
                MatIconModule,
                MatNativeDateModule,
            ],
        }).compileComponents();
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
