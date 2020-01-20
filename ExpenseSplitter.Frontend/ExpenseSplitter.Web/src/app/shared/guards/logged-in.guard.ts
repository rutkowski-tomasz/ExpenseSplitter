import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../auth/auth-service/auth.service';

@Injectable({ providedIn: 'root' })
export class LoggedInGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService,
    ) { }

    canActivate() {
        if (this.authService.isAuthenticated()) {
            return true;
        }

        this.router.navigate(['/login']);
    }
}
