import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeLayoutComponent } from './shared/components/home-layout/home-layout.component';
import { LoggedInGuard } from './shared/guards/logged-in.guard';

const routes: Routes = [
    {
        path: '',
        component: HomeLayoutComponent,
        canActivate: [LoggedInGuard],
        data: { state: 'home' },
        children: [
            {
                path: 'trips/:uid/expenses',
                loadChildren: () => import('./expenses/expenses.module').then(m => m.ExpensesModule)
            },
            {
                path: 'trips/:uid/summary',
                loadChildren: () => import('./summary/summary.module').then(m => m.SummaryModule)
            },
            {
                path: 'trips',
                loadChildren: () => import('./trips/trips.module').then(m => m.TripsModule)
            },
            {
                path: '',
                redirectTo: 'trips',
                pathMatch: 'full'
            },
        ]
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
