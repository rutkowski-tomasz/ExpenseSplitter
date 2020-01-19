import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CantRemoveParticipantWithExpensesSnackBarComponent } from './cant-remove-with-expenses-snack-bar.component';
import { appTesting } from 'src/app/app-testing';

describe('CantRemoveWithExpensesSnackBarComponent', () => {
    let component: CantRemoveParticipantWithExpensesSnackBarComponent;
    let fixture: ComponentFixture<CantRemoveParticipantWithExpensesSnackBarComponent>;

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CantRemoveParticipantWithExpensesSnackBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
