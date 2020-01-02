import { Trip } from './trip';
import { UserExtract } from './user-extract';
import { ExpensePartParticipant } from './expense-part-participant';

export class Participant {
    id: number;
    name: string;

    tripUid: string;
    trip: Trip;

    usersClaimed: UserExtract[];
    expenseParticipations: ExpensePartParticipant[];
}
