import { Injectable } from '@angular/core';
import { CallService } from '../call-service/call.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth-service/auth.service';
import { UserModel } from 'src/app/models/user/user.model';
import { UserUpdateModel } from 'src/app/models/user/user-update.model';
import { AppConfig } from 'src/app/shared/app.config';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private servicePrefix = 'users';

    public userExtract = new BehaviorSubject<UserModel>({
        id: null,
        email: null,
        name: null,
        nick: null,
        isEmailConfirmed: null,
    });
    public preferences = new BehaviorSubject<any>(null);

    constructor(
        private callService: CallService,
        private authService: AuthService,
        private appConfig: AppConfig,
    ) {
        this.loadUserExtract();
        this.initalizePreferences();
    }

    public loadUserExtract(): void {
        const token = this.authService.GetDecodedToken();
        if (token === null) {
            return;
        }

        const userId = this.authService.GetDecodedToken().UserId;
        this.callService.get<UserModel>(`${this.servicePrefix}/${userId}`).subscribe(
            data => this.userExtract.next(data)
        );
    }

    public UpdateUser(model: UserUpdateModel): Observable<UserModel> {
        return this.callService.put<UserModel>(`${this.servicePrefix}`, model);
    }

    private initalizePreferences() {

        const preferences = { };
        preferences[this.appConfig.detailedCalculations] = this.getPreference(this.appConfig.detailedCalculations);
        preferences[this.appConfig.onlyMyExpenses] = this.getPreference(this.appConfig.onlyMyExpenses);

        this.preferences.next(preferences);
    }

    public setPreference(key: string, value: any): void {

        const preferences = { ...this.preferences.value };
        preferences[key] = value;
        this.preferences.next(preferences);

        localStorage.setItem(key, JSON.stringify(value));
    }

    public getPreference(key: string): any {
        return JSON.parse(localStorage.getItem(key));
    }
}
