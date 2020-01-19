export class ParticipantModel {
    public id: number;
    public nick: string;
    public hasAnyExpenses: boolean;
    public claimedUserIds: Array<number>;
}
