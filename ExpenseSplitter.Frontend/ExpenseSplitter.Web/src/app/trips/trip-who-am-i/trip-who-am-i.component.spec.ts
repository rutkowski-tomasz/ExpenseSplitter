import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripWhoAmIComponent } from './trip-who-am-i.component';
import { MatIconModule, MatRadioModule, MatFormFieldModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TripWhoAmIComponent', () => {
    let component: TripWhoAmIComponent;
    let fixture: ComponentFixture<TripWhoAmIComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TripWhoAmIComponent
            ],
            imports: [
                SharedModule,
                RouterTestingModule,
                HttpClientTestingModule,
                MatFormFieldModule,
                MatRadioModule,
                MatIconModule,
                FormsModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TripWhoAmIComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
