import { NgModule } from '@angular/core';
import { MatIconModule, MatTabsModule, MatMenuModule, MatButtonModule } from '@angular/material';

import { SharedModule } from '../shared/shared.module';
import { SummaryBalanceComponent } from './summary-balance/summary-balance.component';
import { SummaryRoutingModule } from './summary-routing.module';
import { SummaryComponent } from './summary/summary.component';
import { SummaryExpenseListComponent } from './summary-expense-list/summary-expense-list.component';
import { SummaryExpenseListFooterComponent } from './summary-expense-list-footer/summary-expense-list-footer.component';

const declarations = [
    SummaryComponent,
    SummaryExpenseListComponent,
    SummaryBalanceComponent,
    SummaryExpenseListFooterComponent,
];

@NgModule({
    declarations: [
        ...declarations,
    ],
    imports: [
        SummaryRoutingModule,
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
export class SummaryModule { }
