import { Injectable } from '@angular/core';
import { CallService } from '../call-service/call.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private servicePrefix = `config`;

    private constants = new BehaviorSubject<Configuration>(null);

    constructor(
        private callService: CallService,
    ) {
        this.LoadConstants();
    }

    public LoadConstants() {

        this.callService
            .get<Configuration>(`${this.servicePrefix}/constants`)
            .subscribe(configuration => {
                this.constants.next(configuration);
            });
    }

    public GetConstant(name: string): Observable<any> {
        return this.constants.pipe(filter(x => !!x), map(x => x[name]));
    }

    public GetConstants(): Observable<Configuration> {
        return this.constants.pipe(filter(x => !!x));
    }
}

class Configuration {
    [name: string]: any;
}
