import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripWhoAmIDialogComponent } from './trip-who-am-i-dialog.component';
import { MatFormFieldModule, MatDialogModule, MatDialogRef, MatInputModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TripWhoAmIDialogComponent', () => {
    let component: TripWhoAmIDialogComponent;
    let fixture: ComponentFixture<TripWhoAmIDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TripWhoAmIDialogComponent,
            ],
            imports: [
                ReactiveFormsModule,
                RouterTestingModule,
                HttpClientTestingModule,
                NoopAnimationsModule,
                MatFormFieldModule,
                MatInputModule,
                MatDialogModule,
            ],
            providers: [
                { provide: MatDialogRef, useValue: {} },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TripWhoAmIDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
