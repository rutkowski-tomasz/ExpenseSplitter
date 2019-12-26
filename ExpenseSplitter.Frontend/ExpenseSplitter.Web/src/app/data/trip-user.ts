import { Trip } from './trip';
import { UserExtract } from './user-extract';

export class TripUser {
    id: number;

    tripUid: string;
    trip: Trip;

    userId: number;
    user: UserExtract;
}
