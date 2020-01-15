import { TestBed, async } from '@angular/core/testing';

import { IsAliveService } from './is-alive.service';
import { appTesting } from 'src/app/app-testing';

describe('IsAliveService', () => {

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    it('should be created', () => {
        const service: IsAliveService = TestBed.get(IsAliveService);
        expect(service).toBeTruthy();
    });
});
