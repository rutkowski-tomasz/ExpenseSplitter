import { BrowserModule, ɵDomSanitizerImpl } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TokenInterceptor } from './auth/token.interceptor';
import { UnauthoriedInterceptor } from './auth/unathorized.interceptor';
import { AppConfig } from './shared/app.config';

import { registerLocaleData } from '@angular/common';
import locale from '@angular/common/locales/pl';
import { IsAliveInterceptor } from './shared/interceptors/is-alive.interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SharedModule } from './shared/shared.module';
import { ErrorStateMatcher, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';
registerLocaleData(locale);

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        AppRoutingModule,
        SharedModule,

        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ],
    providers: [
        AppConfig,
        ɵDomSanitizerImpl,
        { provide: ErrorStateMatcher, useClass: ErrorStateMatcher },
        { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 }},
        { provide: LOCALE_ID, useValue: 'pl' },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: UnauthoriedInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: IsAliveInterceptor,
            multi: true
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
