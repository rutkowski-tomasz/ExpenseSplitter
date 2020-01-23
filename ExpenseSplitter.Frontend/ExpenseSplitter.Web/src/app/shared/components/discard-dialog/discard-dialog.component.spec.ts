import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscardDialogComponent } from './discard-dialog.component';
import { MatDialogModule } from '@angular/material';

describe('DiscardDialogComponent', () => {
    let component: DiscardDialogComponent;
    let fixture: ComponentFixture<DiscardDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DiscardDialogComponent,
            ],
            imports: [
                MatDialogModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DiscardDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
