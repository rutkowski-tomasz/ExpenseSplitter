import { UpdateTripModelParticipant } from './update-trip-model-participant';

export class UpdateTripModel {
    uid: string;
    name: string;
    description: string;

    participants: UpdateTripModelParticipant[];
}

