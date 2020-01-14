import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscardDialog } from './discard-dialog.component';
import { appTesting } from 'src/app/app-testing';

describe('DiscardDialog', () => {
    let component: DiscardDialog;
    let fixture: ComponentFixture<DiscardDialog>;

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DiscardDialog);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
