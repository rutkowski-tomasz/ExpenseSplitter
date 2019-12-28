import { Injectable } from '@angular/core';
import { CallService } from '../call-service/call.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth-service/auth.service';
import { UserExtract } from 'src/app/data/user-extract';
import { UpdateUserModel } from 'src/app/models/user/update-user-model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private servicePrefix = 'users';

    public userExtract = new BehaviorSubject<UserExtract>({
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
        this.callService.get<UserExtract>(`${this.servicePrefix}/${userId}`).subscribe(
            data => this.userExtract.next(data)
        );
    }

    public UpdateUser(model: UpdateUserModel): Observable<UserExtract> {
        return this.callService.put<UserExtract>(`${this.servicePrefix}`, model);
    }
}
