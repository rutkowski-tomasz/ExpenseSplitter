import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { AnonymousGuard } from './guards/anonymous.guard';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { TripsListComponent } from './pages/trips-list/trips-list.component';
import { LoggedInGuard } from './guards/logged-in.guard';
import { TripsCreateComponent } from './pages/trips-create/trips-create.component';

const routes: Routes = [
    {
        path: '',
        component: HomeLayoutComponent,
        canActivate: [LoggedInGuard],
        children: [
            {
                path: 'trips',
                children: [
                    {
                        path: 'new',
                        component: TripsCreateComponent
                    },
                    {
                        path: '',
                        component: TripsListComponent
                    }
                ]
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
        component: LoginLayoutComponent,
        canActivate: [AnonymousGuard],
        children: [
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'register',
                component: RegisterComponent
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
