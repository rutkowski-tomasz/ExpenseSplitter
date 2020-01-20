import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatButtonModule } from '@angular/material';

import { LoginComponent } from './login/login.component';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { RegisterComponent } from './register/register.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SettingsComponent } from './settings/settings.component';
import { SharedModule } from '../shared/shared.module';

const declarations = [
    LoginComponent,
    LoginLayoutComponent,
    RegisterComponent,
    SettingsComponent,
];

@NgModule({
    declarations: [
        ...declarations,
    ],
    imports: [
        AuthRoutingModule,
        SharedModule,

        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
    ],
    exports: [
        ...declarations,
    ],
})
export class AuthModule { }
