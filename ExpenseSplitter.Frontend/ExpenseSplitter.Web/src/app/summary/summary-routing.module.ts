import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SummaryExpenseListComponent } from './summary-expense-list/summary-expense-list.component';
import { SummaryBalanceComponent } from './summary-balance/summary-balance.component';
import { SummaryComponent } from './summary/summary.component';

const routes: Routes = [
    {
        path: '',
        component: SummaryComponent,
        data: { state: 'trip' },
        children: [
            {
                path: 'expenses',
                component: SummaryExpenseListComponent,
                data: { state: 'expenses' },
            },
            {
                path: 'balance',
                component: SummaryBalanceComponent,
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
export class SummaryRoutingModule { }
