import { TestBed, async } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { appTesting } from 'src/app/app-testing';

describe('AuthService', () => {

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    it('should be created', () => {
        const service: AuthService = TestBed.get(AuthService);
        expect(service).toBeTruthy();
    });
});
