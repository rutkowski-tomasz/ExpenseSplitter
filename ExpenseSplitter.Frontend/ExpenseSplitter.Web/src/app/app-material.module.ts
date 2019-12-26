import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatProgressBarModule,
    MatTabsModule,
    MatBadgeModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ErrorStateMatcher,
    ShowOnDirtyErrorStateMatcher,
    MatDialogModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatSnackBarModule,
    MatSelectModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSliderModule,
    MatExpansionModule,
} from '@angular/material';

const materialModules = [
    MatButtonModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatTabsModule,
    MatBadgeModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatSnackBarModule,
    MatSelectModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSliderModule,
    MatExpansionModule,
];

@NgModule({
    imports: materialModules,
    exports: materialModules,
    providers: [
        { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
    ],
})
export class AppMaterialModule { }
