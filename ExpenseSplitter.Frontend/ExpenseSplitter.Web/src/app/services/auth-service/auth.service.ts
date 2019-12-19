import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CallService } from '../call-service/call.service';
import { map } from 'rxjs/operators';
import { LoginModel } from 'src/app/models/auth/login.model';
import { RegisterModel } from 'src/app/models/auth/register.model';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private servicePrefix = 'users';
    private readonly tokenName = 'expensesplitter_auth_token';
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
        const model: LoginModel = { Email: email, Password: password };

        return this.callService
            .post(`${this.servicePrefix}/login`, model)
            .pipe(
                map((data: { token: string }) => {
                    this.setToken(data.token);
                    return true;
                })
            );
    }

    public Register(email: string, password: string) {
        const model: RegisterModel = { Email: email, Password: password };

        return this.callService
            .post(`${this.servicePrefix}/register`, model)
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
