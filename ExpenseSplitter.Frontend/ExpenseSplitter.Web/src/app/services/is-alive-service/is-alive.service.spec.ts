import { TestBed } from '@angular/core/testing';

import { IsAliveService } from './is-alive.service';

describe('IsAliveService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: IsAliveService = TestBed.get(IsAliveService);
        expect(service).toBeTruthy();
    });
});
