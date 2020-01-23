import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseDetailsComponent } from './expense-details.component';
import { MatIconModule } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ExpenseDetailsComponent', () => {
    let component: ExpenseDetailsComponent;
    let fixture: ComponentFixture<ExpenseDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ExpenseDetailsComponent,
            ],
            imports: [
                SharedModule,
                RouterTestingModule,
                HttpClientTestingModule,
                MatIconModule,
            ]
        }).compileComponents();
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
