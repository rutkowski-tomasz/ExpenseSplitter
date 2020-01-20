import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatIconModule } from '@angular/material';

import { DiscardDialogComponent } from './discard/discard-dialog.component';
import { HeaderComponent } from './header/header.component';
import { LoadingComponent } from './loading/loading.component';
import { PageErrorComponent } from './page-error/page-error.component';

const declarations = [
    DiscardDialogComponent,
    HeaderComponent,
    LoadingComponent,
    PageErrorComponent,
];

@NgModule({
    declarations: [
        ...declarations,
    ],
    imports: [
        CommonModule,
        MatDialogModule,
        MatIconModule,
    ],
    exports: [
        CommonModule,
        ...declarations,
    ],
    entryComponents: [
        DiscardDialogComponent,
    ],
})
export class SharedModule { }