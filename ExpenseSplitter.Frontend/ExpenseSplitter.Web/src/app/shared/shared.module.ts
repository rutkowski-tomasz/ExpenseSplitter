import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatIconModule } from '@angular/material';

import { HeaderComponent } from './components/header/header.component';
import { LoadingComponent } from './components/loading/loading.component';
import { PageErrorComponent } from './components/page-error/page-error.component';
import { EnumToArrayPipe } from './pipes/enum-to-array-pipe/enum-to-array.pipe';
import { DiscardDialogComponent } from './components/discard-dialog/discard-dialog.component';
import { ShareDirective } from './directives/share/share.directive';
import { HomeLayoutComponent } from './components/home-layout/home-layout.component';
import { LinkCopiedSnackBarComponent } from './directives/share/link-copied-snack-bar.component';
import { RouterModule } from '@angular/router';

const declarations = [
    DiscardDialogComponent,
    HeaderComponent,
    HomeLayoutComponent,
    LinkCopiedSnackBarComponent,
    LoadingComponent,
    PageErrorComponent,
    ShareDirective,
];

const pipes = [
    EnumToArrayPipe,
];

@NgModule({
    declarations: [
        ...declarations,
        ...pipes,
    ],
    imports: [
        CommonModule,
        MatDialogModule,
        MatIconModule,
        RouterModule,
    ],
    exports: [
        CommonModule,
        ...declarations,
        ...pipes,
    ],
    providers: [
        ...pipes,
    ],
    entryComponents: [
        DiscardDialogComponent,
        LinkCopiedSnackBarComponent,
    ],
})
export class SharedModule { }
