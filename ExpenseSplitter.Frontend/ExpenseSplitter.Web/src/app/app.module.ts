import { BrowserModule, ɵDomSanitizerImpl } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { appDeclarations } from './app-declarations';
import { AppMaterialModule } from './app-material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { UnauthoriedInterceptor } from './interceptors/unathorized.interceptor';
import { AppConfig } from './app.config';

import { registerLocaleData } from '@angular/common';
import locale from '@angular/common/locales/pl';
import { PipesModule } from './pipes/pipes.module';
import { LinkCopiedSnackBarComponent } from './components/link-copied-snack-bar/link-copied-snack-bar.component';
import { DiscardDialog } from './shared/discard/discard-dialog.component';
import { AddTripSheetComponent } from './components/add-trip/add-trip-sheet.component';
import { IsAliveInterceptor } from './interceptors/is-alive.interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CantRemoveParticipantWithExpensesSnackBarComponent } from './components/cant-remove-with-expenses-snack-bar/cant-remove-with-expenses-snack-bar.component';
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
        PipesModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
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
        LinkCopiedSnackBarComponent,
        CantRemoveParticipantWithExpensesSnackBarComponent,
        DiscardDialog,
        AddTripSheetComponent,
    ],
})
export class AppModule { }
