import { ParticipantBalance } from './participant-balance-model';
import { SettleBalance } from './settle-balance-model';

export class BalanceResponseModel {
    participantsBalance: ParticipantBalance[];
    settlesBalance: SettleBalance[];
}
