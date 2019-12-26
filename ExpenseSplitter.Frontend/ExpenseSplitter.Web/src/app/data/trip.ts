import { Participant } from './participant';
import { UserExtract } from './user-extract';
import { Expense } from './expense';

export class Trip
{
    uid: string;
    name: string;
    description: string;
    
    createdAt: Date;
    deletedAt?: Date;

    participants: Participant[];
    users: UserExtract[];
    expenses: Expense[];
}