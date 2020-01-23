import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AnonymousGuard } from '../shared/guards/anonymous.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SettingsComponent } from './settings/settings.component';
import { LoggedInGuard } from '../shared/guards/logged-in.guard';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [AnonymousGuard],
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [AnonymousGuard],
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
