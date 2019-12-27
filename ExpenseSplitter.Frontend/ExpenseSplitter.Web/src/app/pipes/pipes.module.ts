import { NgModule } from '@angular/core';

import { EnumToArrayPipe } from './enum-to-array-pipe/enum-to-array.pipe';

const customPipes = [
    EnumToArrayPipe,
];

@NgModule({
    declarations: [
        ...customPipes,
    ],
    providers: [
        ...customPipes,
    ],
    exports: [
        ...customPipes,
    ]
})
export class PipesModule { }
