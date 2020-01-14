import { TestBed, async } from '@angular/core/testing';

import { ConfigService } from './config.service';
import { appTesting } from 'src/app/app-testing';

describe('ConfigService', () => {

    beforeEach(async(() => {
        TestBed
            .configureTestingModule(appTesting)
            .compileComponents();
    }));

    it('should be created', () => {
        const service: ConfigService = TestBed.get(ConfigService);
        expect(service).toBeTruthy();
    });
});
