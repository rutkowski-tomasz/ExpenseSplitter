import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryExpenseListFooterComponent } from './summary-expense-list-footer.component';
import { MatIconModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SummaryExpenseListFooterComponent', () => {
    let component: SummaryExpenseListFooterComponent;
    let fixture: ComponentFixture<SummaryExpenseListFooterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SummaryExpenseListFooterComponent,
            ],
            imports: [
                RouterTestingModule,
                HttpClientTestingModule,
                MatIconModule,
            ],
        }).compileComponents();
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
