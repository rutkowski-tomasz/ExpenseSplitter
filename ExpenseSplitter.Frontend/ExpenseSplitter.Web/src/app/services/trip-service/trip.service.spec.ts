import { TestBed, async } from '@angular/core/testing';

import { TripService } from './trip.service';
import { appTesting } from 'src/app/app-testing';

describe('TripService', () => {

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    it('should be created', () => {
        const service: TripService = TestBed.get(TripService);
        expect(service).toBeTruthy();
    });
});
