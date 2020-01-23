import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripJoinComponent } from './trip-join.component';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TripJoinComponent', () => {
    let component: TripJoinComponent;
    let fixture: ComponentFixture<TripJoinComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TripJoinComponent,
            ],
            imports: [
                SharedModule,
                RouterTestingModule,
                HttpClientTestingModule,
                ReactiveFormsModule,
                NoopAnimationsModule,
                MatFormFieldModule,
                MatInputModule,
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TripJoinComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
