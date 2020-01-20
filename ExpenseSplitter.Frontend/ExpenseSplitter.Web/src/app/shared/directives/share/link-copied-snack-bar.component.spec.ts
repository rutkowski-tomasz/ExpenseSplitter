import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkCopiedSnackBarComponent } from './link-copied-snack-bar.component';
import { appTesting } from 'src/app/app-testing';

describe('LinkCopiedSnackBarComponent', () => {
    let component: LinkCopiedSnackBarComponent;
    let fixture: ComponentFixture<LinkCopiedSnackBarComponent>;

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LinkCopiedSnackBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
