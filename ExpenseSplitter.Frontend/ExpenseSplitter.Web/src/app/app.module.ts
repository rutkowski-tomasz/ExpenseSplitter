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
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
