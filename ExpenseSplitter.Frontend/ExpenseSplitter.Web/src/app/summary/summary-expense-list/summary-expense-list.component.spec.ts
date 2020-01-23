import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryExpenseListComponent } from './summary-expense-list.component';
import { SummaryExpenseListFooterComponent } from '../summary-expense-list-footer/summary-expense-list-footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('SummaryExpenseListComponent', () => {
    let component: SummaryExpenseListComponent;
    let fixture: ComponentFixture<SummaryExpenseListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SummaryExpenseListComponent,
                SummaryExpenseListFooterComponent,
            ],
            imports: [
                RouterTestingModule,
                HttpClientTestingModule,
                MatIconModule,
            ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        parent: { params: of({ uid: 'test' }) }
                    }
                },
            ],
        }).compileComponents();
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
