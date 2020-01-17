import { Injectable } from '@angular/core';
import { CallService } from '../call-service/call.service';
import { Observable, BehaviorSubject, pipe } from 'rxjs';
import { TripCreateModel } from 'src/app/models/trip/trip-create.model';
import { TripUpdateModel } from 'src/app/models/trip/trip-update.model';
import { ParticipantModel } from 'src/app/models/participant/participant.model';
import { TripListModel } from 'src/app/models/trip/trip-list.model';
import { TripDetailsModel } from 'src/app/models/trip/trip-details.model';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TripService {
    private servicePrefix = 'trips';

    public lastUpdatedTripUid = new BehaviorSubject<string>(null);

    constructor(
        private callService: CallService,
    ) { }

    public GetTrips(): Observable<TripListModel[]> {
        return this.callService.get(`${this.servicePrefix}`);
    }

    public GetTrip(uid: string): Observable<TripDetailsModel> {
        return this.callService.get(`${this.servicePrefix}/${uid}`);
    }

    public GetParticipants(uid: string): Observable<ParticipantModel[]> {
        return this.callService.get(`${this.servicePrefix}/${uid}/participants`);
    }

    public CreateTrip(model: TripCreateModel): Observable<string> {
        return this.callService
            .post<string>(`${this.servicePrefix}`, model)
            .pipe(
                tap(x => this.lastUpdatedTripUid.next(x))
            );
    }

    public UpdateTrip(model: TripUpdateModel): Observable<boolean> {
        return this.callService
            .put<boolean>(`${this.servicePrefix}`, model)
            .pipe(
                tap(x => this.lastUpdatedTripUid.next(model.uid))
            );
    }

    public DeleteTrip(uid: string): Observable<boolean> {
        return this.callService.delete(`${this.servicePrefix}/${uid}`);
    }

    public JoinTrip(uid: string): Observable<boolean> {
        return this.callService.post(`${this.servicePrefix}/${uid}/join`, {});
    }

    public LeaveTrip(uid: string): Observable<boolean> {
        return this.callService.post(`${this.servicePrefix}/${uid}/leave`, {});
    }

    public ClaimTripParticipation(uid: string, id: number): Observable<boolean> {
        return this.callService.post(`${this.servicePrefix}/${uid}/participation/${id}`, {});
    }
}
