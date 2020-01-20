import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { AnonymousGuard } from '../shared/guards/anonymous.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SettingsComponent } from './settings/settings.component';
import { LoggedInGuard } from '../shared/guards/logged-in.guard';

const routes: Routes = [
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
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [LoggedInGuard],
        data: { state: 'settings' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule { }