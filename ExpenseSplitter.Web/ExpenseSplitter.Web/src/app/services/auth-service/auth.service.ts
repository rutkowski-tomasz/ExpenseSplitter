import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CallService } from '../call-service/call.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private servicePrefix = 'user';
    private readonly tokenName = 'frugal_tools_auth_token';
    private helper = new JwtHelperService();

    constructor(
        private callService: CallService,
        private router: Router,
    ) { }

    public getToken(): string {
        return localStorage.getItem(this.tokenName);
    }

    public isAuthenticated(): boolean {
        const rawToken = this.getToken();
        return !this.helper.isTokenExpired(rawToken);
    }

    public logOut(): void {
        localStorage.removeItem(this.tokenName);
        this.RedirectToLogin();
    }

    public logIn(email: string, password: string): any {
        return this.callService
            .post(`${this.servicePrefix}/login`, {
                Email: email,
                Password: password
            })
            .pipe(
                map((data: { token: string }) => {
                    this.setToken(data.token);
                    return true;
                })
            );
    }

    public RedirectToLogin(): void {
        this.router.navigate(['/login']);
    }

    public GetDecodedToken() {
        const token = this.getToken();
        const decoded = this.helper.decodeToken(token);
        return decoded;
    }

    private setToken(token: string): void {
        localStorage.setItem(this.tokenName, token);
    }
}
