import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripListComponent } from './trip-list.component';
import { MatIconModule, MatMenuModule } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TripListComponent', () => {
    let component: TripListComponent;
    let fixture: ComponentFixture<TripListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TripListComponent,
            ],
            imports: [
                SharedModule,
                RouterTestingModule,
                HttpClientTestingModule,
                MatIconModule,
                MatMenuModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TripListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
