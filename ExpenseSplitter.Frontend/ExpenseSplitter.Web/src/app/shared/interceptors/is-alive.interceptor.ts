import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { IsAliveService } from '../services/is-alive-service/is-alive.service';

@Injectable()
export class IsAliveInterceptor implements HttpInterceptor {

    constructor(
        private isAliveService: IsAliveService,
    ) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        return next
            .handle(req)
            .pipe(
                catchError(error => {
        
                    if (error instanceof HttpErrorResponse && error.status === 0) {
                        this.isAliveService.serverIsAlive.next(false);
                    }

                    throw error;
                })
            );
    }
}
