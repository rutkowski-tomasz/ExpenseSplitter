import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ExpensesComponent } from '../trips-summary/expenses/expenses.component';
import { BalanceComponent } from '../trips-summary/balance/balance.component';
import { SettlementFooterComponent } from '../trips-summary/settlement-footer/settlement-footer.component';
import { TripsSummaryRoutingModule } from './trips-summary-routing.module';
import { TripComponent } from './trip/trip.component';
import { MatIconModule, MatTabsModule, MatMenuModule, MatButtonModule } from '@angular/material';

const declarations = [
    TripComponent,
    ExpensesComponent,
    BalanceComponent,
    SettlementFooterComponent,
];

@NgModule({
    declarations: [
        ...declarations,
    ],
    imports: [
        TripsSummaryRoutingModule,
        SharedModule,

        MatIconModule,
        MatMenuModule,
        MatTabsModule,
        MatButtonModule,
    ],
    exports: [
        ...declarations,
    ],
})
export class TripsModule { }
