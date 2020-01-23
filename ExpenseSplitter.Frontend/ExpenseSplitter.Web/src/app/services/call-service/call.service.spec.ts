import { TestBed } from '@angular/core/testing';

import { CallService } from './call.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CallService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]}));

    it('should be created', () => {
        const service: CallService = TestBed.get(CallService);
        expect(service).toBeTruthy();
    });
});
