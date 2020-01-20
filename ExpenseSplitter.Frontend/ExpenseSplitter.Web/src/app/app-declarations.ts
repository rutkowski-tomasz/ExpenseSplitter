import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { TripsListComponent } from './pages/trips-list/trips-list.component';
import { TripsCreateComponent } from './pages/trips-create/trips-create.component';
import { TripComponent } from './pages/trip/trip.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { BalanceComponent } from './pages/balance/balance.component';
import { SettlementFooterComponent } from './components/settlement-footer/settlement-footer.component';
import { ExpenseTypeComponent } from './components/expense-type/expense-type.component';
import { TripEditComponent } from './pages/trip-edit/trip-edit.component';
import { ShareDirective } from './directives/share.directive';
import { LinkCopiedSnackBarComponent } from './components/link-copied-snack-bar/link-copied-snack-bar.component';
import { ExpenseEditComponent } from './pages/expense-edit/expense-edit.component';
import { ExpenseDetailsComponent } from './pages/expense-details/expense-details.component';
import { AddTripSheetComponent } from './components/add-trip/add-trip-sheet.component';
import { TripJoinComponent } from './pages/trip-join/trip-join.component';
import { CantRemoveParticipantWithExpensesSnackBarComponent } from './components/cant-remove-with-expenses-snack-bar/cant-remove-with-expenses-snack-bar.component';
import { TripWhoAmIComponent } from './pages/trip-who-am-i/trip-who-am-i.component';

export const appDeclarations = [
    HomeLayoutComponent,

    TripsListComponent,
    TripsCreateComponent,
    TripEditComponent,
    TripComponent,
    TripJoinComponent,
    TripWhoAmIComponent,
    ExpensesComponent,
    BalanceComponent,
    ExpenseEditComponent,
    ExpenseDetailsComponent,

    SettlementFooterComponent,
    ExpenseTypeComponent,
    LinkCopiedSnackBarComponent,
    AddTripSheetComponent,
    CantRemoveParticipantWithExpensesSnackBarComponent,

    ShareDirective,
];
