import { Injectable } from '@angular/core';
import { CallService } from '../call-service/call.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth-service/auth.service';
import { UserModel } from 'src/app/models/user/user.model';
import { UserUpdateModel } from 'src/app/models/user/user-update.model';

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

    constructor(
        private callService: CallService,
        private authService: AuthService,
    ) {
        this.loadUserExtract();
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
}
