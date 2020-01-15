import { ParticipantModel } from '../participant/participant.model';

export class TripDetailsModel {
    uid: string;
    name: string;
    description: string;
    participants: ParticipantModel[];
}
