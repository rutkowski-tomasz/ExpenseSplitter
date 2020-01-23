import { TestBed, async } from '@angular/core/testing';

import { UserService } from './user.service';
import { appTesting } from 'src/app/app-testing';

describe('UserService', () => {

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    it('should be created', () => {
        const service: UserService = TestBed.get(UserService);
        expect(service).toBeTruthy();
    });
});
