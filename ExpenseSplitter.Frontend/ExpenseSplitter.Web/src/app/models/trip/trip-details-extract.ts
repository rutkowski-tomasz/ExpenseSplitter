import { ParticipantExtractModel } from '../participant/participant-extract-model';

export class TripDetailsExtract {
    uid: string;
    name: string;
    description: string;
    participants: ParticipantExtractModel[];
}
