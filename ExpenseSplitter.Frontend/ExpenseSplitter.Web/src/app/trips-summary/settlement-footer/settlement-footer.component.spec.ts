import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementFooterComponent } from './settlement-footer.component';
import { appTesting } from 'src/app/app-testing';

describe('SettlementFooterComponent', () => {
    let component: SettlementFooterComponent;
    let fixture: ComponentFixture<SettlementFooterComponent>;

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettlementFooterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
