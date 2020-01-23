import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkCopiedSnackBarComponent } from './link-copied-snack-bar.component';

describe('LinkCopiedSnackBarComponent', () => {
    let component: LinkCopiedSnackBarComponent;
    let fixture: ComponentFixture<LinkCopiedSnackBarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LinkCopiedSnackBarComponent]
        })
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
