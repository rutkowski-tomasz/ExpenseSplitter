import { TestBed, async } from '@angular/core/testing';

import { ExpenseService } from './expense.service';
import { appTesting } from 'src/app/app-testing';

describe('ExpenseService', () => {

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    it('should be created', () => {
        const service: ExpenseService = TestBed.get(ExpenseService);
        expect(service).toBeTruthy();
    });
});
