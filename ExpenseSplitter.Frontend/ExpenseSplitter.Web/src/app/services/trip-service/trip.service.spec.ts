import { TestBed } from '@angular/core/testing';

import { TripService } from './trip.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TripService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            HttpClientTestingModule,
        ],
    }));

    it('should be created', () => {
        const service: TripService = TestBed.get(TripService);
        expect(service).toBeTruthy();
    });
});
