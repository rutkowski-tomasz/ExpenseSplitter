import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripEditComponent } from './trip-edit.component';
import { MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TripEditComponent', () => {
    let component: TripEditComponent;
    let fixture: ComponentFixture<TripEditComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TripEditComponent,
            ],
            imports: [
                SharedModule,
                RouterTestingModule,
                HttpClientTestingModule,
                ReactiveFormsModule,
                NoopAnimationsModule,
                MatFormFieldModule,
                MatInputModule,
                MatIconModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TripEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
