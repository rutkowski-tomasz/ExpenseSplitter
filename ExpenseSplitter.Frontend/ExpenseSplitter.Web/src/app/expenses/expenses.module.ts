import { NgModule } from '@angular/core';

import { ExpensesRoutingModule } from './expenses-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CantRemoveParticipantWithExpensesSnackBarComponent } from './cant-remove-with-expenses-snack-bar/cant-remove-with-expenses-snack-bar.component';
import { ExpenseDetailsComponent } from './expense-details/expense-details.component';
import { ExpenseEditComponent } from './expense-edit/expense-edit.component';
import { ExpenseTypeComponent } from './expense-type/expense-type.component';
import { MatIconModule, MatFormFieldModule, MatDatepickerModule, MatAutocompleteModule, MatCheckboxModule, MatButtonModule, MatInputModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

const declarations = [
    CantRemoveParticipantWithExpensesSnackBarComponent,
    ExpenseDetailsComponent,
    ExpenseEditComponent,
    ExpenseTypeComponent,
];

@NgModule({
    declarations: [
        ...declarations,
    ],
    imports: [
        ExpensesRoutingModule,
        SharedModule,

        ReactiveFormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatButtonModule,
        MatInputModule,
    ],
    exports: [
        ...declarations,
    ],
    entryComponents: [
        CantRemoveParticipantWithExpensesSnackBarComponent,
    ],
})
export class ExpensesModule { }
