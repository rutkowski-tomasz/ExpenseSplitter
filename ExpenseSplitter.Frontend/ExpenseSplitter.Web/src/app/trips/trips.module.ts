import { NgModule } from '@angular/core';

import { TripsRoutingModule } from './trips-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TripAddSheetComponent } from './trip-add-sheet/add-trip-sheet.component';
import { TripEditComponent } from './trip-edit/trip-edit.component';
import { TripJoinComponent } from './trip-join/trip-join.component';
import { TripWhoAmIComponent } from './trip-who-am-i/trip-who-am-i.component';
import { TripCreateComponent } from './trip-create/trip-create.component';
import { TripListComponent } from './trip-list/trip-list.component';
import { MatListModule, MatIconModule, MatButtonModule, MatMenuModule, MatFormFieldModule, MatRadioModule, MatInputModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const declarations = [
    TripAddSheetComponent,
    TripEditComponent,
    TripJoinComponent,
    TripWhoAmIComponent,
    TripCreateComponent,
    TripListComponent,
];

@NgModule({
    declarations: [
        ...declarations,
    ],
    imports: [
        TripsRoutingModule,
        SharedModule,

        FormsModule,
        ReactiveFormsModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatFormFieldModule,
        MatRadioModule,
        MatInputModule,
    ],
    exports: [
        ...declarations,
    ],
    entryComponents: [
        TripAddSheetComponent,
    ],
})
export class TripsModule { }
