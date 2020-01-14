import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { ConfirmDiscardChanges } from './confirm-discard-changes.interface';
import { DiscardDialog } from './discard-dialog.component';
import { MatDialog } from '@angular/material';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DiscardCanDeactivateGuard implements CanDeactivate<ConfirmDiscardChanges> {

    private discardSubject = new Subject<boolean>();

    constructor(
        private matDialog: MatDialog,
    ) { }

    public discard(): void {
        this.discardSubject.next(true);
    }

    public keep(): void {
        this.discardSubject.next(false);
    }

    public canDeactivate(
        component: ConfirmDiscardChanges,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot
    ): Observable<boolean> | boolean {

        if (component.isDirty()) {
            return this.openDiscardDialog();
        }

        return true;
    }

    public openDiscardDialog(): Observable<boolean> {

        const dialogRef = this.matDialog.open(DiscardDialog);
        return dialogRef.afterClosed().pipe(map(x => !!x));
    }
}