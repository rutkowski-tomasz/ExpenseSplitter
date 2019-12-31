import { Injectable } from '@angular/core';
import { CallService } from '../call-service/call.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth-service/auth.service';
import { UserExtract } from 'src/app/data/user-extract';
import { Trip } from 'src/app/data/trip';
import { CreateTripModel } from 'src/app/models/trip/create-trip-model';
import { UpdateTripModel } from 'src/app/models/trip/update-trip-model';

@Injectable({
    providedIn: 'root'
})
export class TripService {
    private servicePrefix = 'trips';

    constructor(
        private callService: CallService,
    ) { }

    public GetTrips(): Observable<Trip[]> {
        return this.callService.get<Trip[]>(`${this.servicePrefix}`);
    }

    public GetTrip(uid: string): Observable<Trip> {
        return this.callService.get<Trip>(`${this.servicePrefix}/${uid}`);
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
