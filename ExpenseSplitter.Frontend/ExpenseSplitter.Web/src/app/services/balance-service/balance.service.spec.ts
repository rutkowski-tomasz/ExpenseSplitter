import { TestBed, async } from '@angular/core/testing';

import { BalanceService } from './balance.service';
import { appTesting } from 'src/app/app-testing';

describe('BalanceService', () => {

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    it('should be created', () => {
        const service: BalanceService = TestBed.get(BalanceService);
        expect(service).toBeTruthy();
    });
});
