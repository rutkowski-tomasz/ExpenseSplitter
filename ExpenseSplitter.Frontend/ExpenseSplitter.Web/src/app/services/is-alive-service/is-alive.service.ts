import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class IsAliveService {

    public serverIsAlive = new BehaviorSubject<boolean>(true);

}
