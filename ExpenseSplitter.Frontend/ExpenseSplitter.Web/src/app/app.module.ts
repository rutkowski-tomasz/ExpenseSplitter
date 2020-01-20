import { BrowserModule, ɵDomSanitizerImpl } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { appDeclarations } from './app-declarations';
import { AppMaterialModule } from './app-material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TokenInterceptor } from './auth/token.interceptor';
import { UnauthoriedInterceptor } from './auth/unathorized.interceptor';
import { AppConfig } from './shared/app.config';

import { registerLocaleData } from '@angular/common';
import locale from '@angular/common/locales/pl';
import { AddTripSheetComponent } from './components/add-trip/add-trip-sheet.component';
import { IsAliveInterceptor } from './shared/interceptors/is-alive.interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CantRemoveParticipantWithExpensesSnackBarComponent } from './components/cant-remove-with-expenses-snack-bar/cant-remove-with-expenses-snack-bar.component';
import { SharedModule } from './shared/shared.module';
registerLocaleData(locale);

@NgModule({
    declarations: [
        AppComponent,
        ...appDeclarations,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        SharedModule,
    ],
    providers: [
        AppConfig,
        ɵDomSanitizerImpl,
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
    entryComponents: [
        CantRemoveParticipantWithExpensesSnackBarComponent,
        AddTripSheetComponent,
    ],
})
export class AppModule { }
