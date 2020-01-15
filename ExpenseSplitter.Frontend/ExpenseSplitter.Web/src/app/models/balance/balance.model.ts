import { BalanceParticipantModel } from './balance-participant.model';
import { BalanceSettleModel } from './balance-settle.model';

export class BalanceModel {
    participantsBalance: BalanceParticipantModel[];
    settlesBalance: BalanceSettleModel[];
}
