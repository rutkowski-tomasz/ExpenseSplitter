import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseDetailsComponent } from './expense-details/expense-details.component';
import { ExpenseEditComponent } from './expense-edit/expense-edit.component';
import { DiscardCanDeactivateGuard } from '../shared/components/discard-dialog/discard.deactivate.guard';

const routes: Routes = [
    {
        path: 'new-expense',
        component: ExpenseEditComponent,
        data: { state: 'expenseCreate' },
        canDeactivate: [ DiscardCanDeactivateGuard ],
    },
    {
        path: 'expenses/:id/edit',
        component: ExpenseEditComponent,
        data: { state: 'expenseEdit' },
        canDeactivate: [ DiscardCanDeactivateGuard ],
    },
    {
        path: 'expenses/:id',
        component: ExpenseDetailsComponent,
        data: { state: 'expenseDetails' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ExpensesRoutingModule { }
