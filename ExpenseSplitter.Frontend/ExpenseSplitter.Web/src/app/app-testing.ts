import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { appDeclarations } from './app-declarations';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from './app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppConfig } from './shared/app.config';
import { ɵDomSanitizerImpl, HAMMER_LOADER } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export const appTesting = {
    declarations: [
        AppComponent,
        ...appDeclarations,
    ],
    imports: [
        BrowserTestingModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialModule,
        AppRoutingModule,
    ],
    providers: [
        AppConfig,
        ɵDomSanitizerImpl,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: HAMMER_LOADER, useValue: () => new Promise(() => {}) }
    ],
};
