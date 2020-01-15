import { TripParticipantModel } from './trip-participant.model';

export class TripUpdateModel {
    uid: string;
    name: string;
    description: string;

    participants: TripParticipantModel[];
}

