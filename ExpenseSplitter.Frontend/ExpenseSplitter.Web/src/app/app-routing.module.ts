import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { TripsListComponent } from './pages/trips-list/trips-list.component';
import { LoggedInGuard } from './guards/logged-in.guard';
import { TripsCreateComponent } from './pages/trips-create/trips-create.component';
import { TripComponent } from './pages/trip/trip.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { BalanceComponent } from './pages/balance/balance.component';
import { TripEditComponent } from './pages/trip-edit/trip-edit.component';
import { ExpenseEditComponent } from './pages/expense-edit/expense-edit.component';
import { ExpenseDetailsComponent } from './pages/expense-details/expense-details.component';
import { DiscardCanDeactivateGuard } from './shared/discard/discard.deactivate.guard';
import { TripJoinComponent } from './pages/trip-join/trip-join.component';
import { TripWhoAmIComponent } from './pages/trip-who-am-i/trip-who-am-i.component';

const routes: Routes = [
    {
        path: '',
        component: HomeLayoutComponent,
        canActivate: [LoggedInGuard],
        data: { state: 'home' },
        children: [
            {
                path: 'trips',
                children: [
                    {
                        path: 'new',
                        component: TripsCreateComponent,
                        data: { state: 'tripCreate' },
                        canDeactivate: [ DiscardCanDeactivateGuard ],
                    },
                    {
                        path: ':uid/new-expense',
                        component: ExpenseEditComponent,
                        data: { state: 'expenseCreate' },
                        canDeactivate: [ DiscardCanDeactivateGuard ],
                    },
                    {
                        path: ':uid/edit',
                        component: TripEditComponent,
                        data: { state: 'tripEdit' },
                        canDeactivate: [ DiscardCanDeactivateGuard ],
                    },
                    {
                        path: ':uid/who-am-i',
                        component: TripWhoAmIComponent,
                        data: { state: 'tripWhoAmI' },
                        canDeactivate: [ DiscardCanDeactivateGuard ],
                    },
                    {
                        path: ':uid/expenses/:id/edit',
                        component: ExpenseEditComponent,
                        data: { state: 'expenseEdit' },
                        canDeactivate: [ DiscardCanDeactivateGuard ],
                    },
                    {
                        path: ':uid/expenses/:id',
                        component: ExpenseDetailsComponent,
                        data: { state: 'expenseDetails' },
                    },
                    {
                        path: ':uid',
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
                    },
                    {
                        path: '',
                        component: TripsListComponent,
                        data: { state: 'tripsList' },
                    }
                ]
            },
            {
                path: 'join/:uid',
                component: TripJoinComponent,
                data: { state: 'tripJoin' },
            },
            {
                path: 'join',
                component: TripJoinComponent,
                data: { state: 'tripJoin' },
            },
            {
                path: '',
                redirectTo: 'trips',
                pathMatch: 'full'
            },
        ]
    },
    {
        path: '',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
