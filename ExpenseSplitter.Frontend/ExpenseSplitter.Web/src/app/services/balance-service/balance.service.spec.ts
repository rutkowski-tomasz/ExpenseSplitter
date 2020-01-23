import { TestBed } from '@angular/core/testing';

import { BalanceService } from './balance.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BalanceService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            HttpClientTestingModule,
        ],
    }));

    it('should be created', () => {
        const service: BalanceService = TestBed.get(BalanceService);
        expect(service).toBeTruthy();
    });
});
