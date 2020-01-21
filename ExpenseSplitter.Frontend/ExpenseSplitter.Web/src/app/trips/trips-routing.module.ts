import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TripsCreateComponent } from './trips-create/trips-create.component';
import { DiscardCanDeactivateGuard } from '../shared/components/discard-dialog/discard.deactivate.guard';
import { TripEditComponent } from './trip-edit/trip-edit.component';
import { TripWhoAmIComponent } from './trip-who-am-i/trip-who-am-i.component';
import { TripsListComponent } from './trips-list/trips-list.component';
import { TripJoinComponent } from './trip-join/trip-join.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'new',
                component: TripsCreateComponent,
                data: { state: 'tripCreate' },
                canDeactivate: [ DiscardCanDeactivateGuard ],
            },
            {
                path: '',
                component: TripsListComponent,
                data: { state: 'tripsList' },
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
                path: ':uid',
                children: [
                    {
                        path: 'edit',
                        component: TripEditComponent,
                        data: { state: 'tripEdit' },
                        canDeactivate: [ DiscardCanDeactivateGuard ],
                    },
                    {
                        path: 'who-am-i',
                        component: TripWhoAmIComponent,
                        data: { state: 'tripWhoAmI' },
                        canDeactivate: [ DiscardCanDeactivateGuard ],
                    },
                    {
                        path: '',
                        loadChildren: () => import('../trips-summary/trips-summary.module').then(m => m.TripsModule)
                    },
                    {
                        path: '',
                        loadChildren: () => import('../expenses/expenses.module').then(m => m.ExpensesModule),
                    },
                ]
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TripsRoutingModule { }
