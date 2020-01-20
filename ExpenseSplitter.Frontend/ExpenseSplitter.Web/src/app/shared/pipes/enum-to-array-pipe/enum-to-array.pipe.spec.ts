import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { TestBed } from '@angular/core/testing';
import { AppConfig } from 'src/app/shared/app.config';
import { EnumToArrayPipe } from './enum-to-array.pipe';

describe('EnumToArrayPipe', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [BrowserTestingModule],
            providers: [ AppConfig ]
        });
    });

    it('should correcly transform enum to array', () => {
        const pipe = new EnumToArrayPipe();

        enum Colors {
            Red = 1,
            Green = 2,
            Blue = 4,
        }

        const transformed = pipe.transform(Colors);
        expect(transformed).toEqual([1, 2, 4]);
    });
});
