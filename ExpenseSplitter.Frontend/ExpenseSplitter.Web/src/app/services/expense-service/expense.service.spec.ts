import { TestBed } from '@angular/core/testing';

import { ExpenseService } from './expense.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ExpenseService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            HttpClientTestingModule,
        ],
    }));

    it('should be created', () => {
        const service: ExpenseService = TestBed.get(ExpenseService);
        expect(service).toBeTruthy();
    });
});
