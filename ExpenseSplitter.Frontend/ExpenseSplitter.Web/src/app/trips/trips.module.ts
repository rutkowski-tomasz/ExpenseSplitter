import { NgModule } from '@angular/core';

import { TripsRoutingModule } from './trips-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AddTripSheetComponent } from './add-trip/add-trip-sheet.component';
import { TripEditComponent } from './trip-edit/trip-edit.component';
import { TripJoinComponent } from './trip-join/trip-join.component';
import { TripWhoAmIComponent } from './trip-who-am-i/trip-who-am-i.component';
import { TripsCreateComponent } from './trips-create/trips-create.component';
import { TripsListComponent } from './trips-list/trips-list.component';
import { MatListModule, MatIconModule, MatTabsModule, MatButtonModule, MatMenuModule, MatFormFieldModule, MatRadioModule, MatInputModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const declarations = [
    AddTripSheetComponent,
    TripEditComponent,
    TripJoinComponent,
    TripWhoAmIComponent,
    TripsCreateComponent,
    TripsListComponent,
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
        AddTripSheetComponent,
    ],
})
export class TripsModule { }
