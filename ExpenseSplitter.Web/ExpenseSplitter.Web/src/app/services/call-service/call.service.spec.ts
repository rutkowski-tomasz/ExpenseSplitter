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

    describe('formUrlParam function', () => {

        it('should form URL when no params provided', () => {

            const service: CallService = TestBed.get(CallService);
            const url = service.formUrlParam('http://localhost:1234/controller/method');
            expect(url).toBe('http://localhost:1234/controller/method');
        });

        it('should form URL when empty params provided', () => {

            const service: CallService = TestBed.get(CallService);
            const url = service.formUrlParam('http://example.com/endpoint', {});
            expect(url).toBe('http://example.com/endpoint');
        });

        it('should form URL with one param', () => {

            const service: CallService = TestBed.get(CallService);
            const url = service.formUrlParam('http://someaddress.pl/endpoint', { test: 'value' });
            expect(url).toBe('http://someaddress.pl/endpoint?test=value');
        });

        it('should form URL with many params', () => {

            const service: CallService = TestBed.get(CallService);
            const url = service.formUrlParam('http://example.com/api', { param1: 'string', param2: 2, param3: 1.33 });
            expect(url).toBe('http://example.com/api?param1=string&param2=2&param3=1.33');
        });

        it('should form URL with array parameter', () => {

            const service: CallService = TestBed.get(CallService);
            const url = service.formUrlParam('http://example.com/api', { param: [1, 2, 3] });
            expect(url).toBe('http://example.com/api?param=1&param=2&param=3');
        });
    });
});
