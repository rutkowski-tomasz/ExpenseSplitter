import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'enumToArray'
})
export class EnumToArrayPipe implements PipeTransform {

    public transform(value): Array<number> {
        const keys = Object.keys(value);
        return keys.slice(0, keys.length / 2).map(x => +x);
    }
}
