import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TripComponent } from './trip/trip.component';
import { ExpensesComponent } from '../trips-summary/expenses/expenses.component';
import { BalanceComponent } from '../trips-summary/balance/balance.component';

const routes: Routes = [
    {
        path: '',
        component: TripComponent,
        data: { state: 'trip' },
        children: [
            {
                path: 'expenses',
                component: ExpensesComponent,
                data: { state: 'expenses' },
            },
            {
                path: 'balance',
                component: BalanceComponent,
                data: { state: 'balance' },
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'expenses'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TripsSummaryRoutingModule { }
