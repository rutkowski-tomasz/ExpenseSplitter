import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { appTesting } from './app-testing';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });
});
