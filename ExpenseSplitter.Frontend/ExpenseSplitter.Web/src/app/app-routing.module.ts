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
        path: '',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
