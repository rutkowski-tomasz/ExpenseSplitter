import { Injectable } from '@angular/core';
import { CallService } from '../call-service/call.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth-service/auth.service';
import { UserExtract } from 'src/app/data/user-extract';
import { Trip } from 'src/app/data/trip';
import { CreateTripModel } from 'src/app/models/trip/create-trip-model';
import { UpdateTripModel } from 'src/app/models/trip/update-trip-model';
import { ParticipantExtractModel } from 'src/app/models/participant/participant-extract-model';
import { TripExtract } from 'src/app/models/trip/trip-extract';
import { TripDetailsExtract } from 'src/app/models/trip/trip-details-extract';

@Injectable({
    providedIn: 'root'
})
export class TripService {
    private servicePrefix = 'trips';

    constructor(
        private callService: CallService,
    ) { }

    public GetTrips(): Observable<TripExtract[]> {
        return this.callService.get<TripExtract[]>(`${this.servicePrefix}`);
    }

    public GetTrip(uid: string): Observable<TripDetailsExtract> {
        return this.callService.get<TripDetailsExtract>(`${this.servicePrefix}/${uid}`);
    }

    public GetParticipants(uid: string): Observable<ParticipantExtractModel[]> {
        return this.callService.get<ParticipantExtractModel[]>(`${this.servicePrefix}/${uid}/participants`);
    }

    public CreateTrip(model: CreateTripModel): Observable<Trip> {
        return this.callService.post(`${this.servicePrefix}`, model);
    }

    public UpdateTrip(model: UpdateTripModel): Observable<Trip> {
        return this.callService.put(`${this.servicePrefix}`, model);
    }

    public DeleteTrip(uid: string) {
        return this.callService.delete(`${this.servicePrefix}/${uid}`);
    }

    public JoinTrip(uid: string) {
        return this.callService.post(`${this.servicePrefix}/${uid}/join`, {});
    }

    public LeaveTrip(uid: string) {
        return this.callService.post(`${this.servicePrefix}/${uid}/leave`, {});
    }

    public ClaimTripParticipation(uid: string, id: number) {
        return this.callService.post(`${this.servicePrefix}/${uid}/participation/${id}`, {});
    }
}
