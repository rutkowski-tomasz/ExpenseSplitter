import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { TripsListComponent } from './pages/trips-list/trips-list.component';
import { TripsCreateComponent } from './pages/trips-create/trips-create.component';

export const appDeclarations = [
    LoginLayoutComponent,
    HomeLayoutComponent,

    LoginComponent,
    RegisterComponent,

    TripsListComponent,
    TripsCreateComponent,
];
