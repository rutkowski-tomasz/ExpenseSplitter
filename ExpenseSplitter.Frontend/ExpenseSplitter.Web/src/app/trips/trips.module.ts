import { NgModule } from '@angular/core';

import { TripsRoutingModule } from './trips-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AddTripSheetComponent } from './add-trip/add-trip-sheet.component';
import { TripComponent } from './trip/trip.component';
import { TripEditComponent } from './trip-edit/trip-edit.component';
import { TripJoinComponent } from './trip-join/trip-join.component';
import { TripWhoAmIComponent } from './trip-who-am-i/trip-who-am-i.component';
import { TripsCreateComponent } from './trips-create/trips-create.component';
import { TripsListComponent } from './trips-list/trips-list.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { BalanceComponent } from './balance/balance.component';
import { MatListModule, MatIconModule, MatTabsModule, MatButtonModule, MatMenuModule, MatFormFieldModule, MatRadioModule, MatInputModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SettlementFooterComponent } from './settlement-footer/settlement-footer.component';

const declarations = [
    AddTripSheetComponent,
    TripComponent,
    TripEditComponent,
    TripJoinComponent,
    TripWhoAmIComponent,
    TripsCreateComponent,
    TripsListComponent,

    ExpensesComponent,
    BalanceComponent,
    SettlementFooterComponent,
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
        MatTabsModule,
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
