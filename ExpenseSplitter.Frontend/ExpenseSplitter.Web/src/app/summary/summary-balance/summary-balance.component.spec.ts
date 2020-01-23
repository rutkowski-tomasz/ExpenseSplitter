import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryBalanceComponent } from './summary-balance.component';
import { MatIconModule, MatMenuModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('SummaryBalanceComponent', () => {
    let component: SummaryBalanceComponent;
    let fixture: ComponentFixture<SummaryBalanceComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SummaryBalanceComponent,
            ],
            imports: [
                RouterTestingModule,
                HttpClientTestingModule,
                MatIconModule,
                MatMenuModule,
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
        fixture = TestBed.createComponent(SummaryBalanceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
