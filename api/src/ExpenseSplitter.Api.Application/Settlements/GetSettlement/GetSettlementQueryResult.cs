namespace ExpenseSplitter.Api.Application.Settlements.GetSettlement;

public sealed record GetSettlementQueryResult(
    Guid Id,
    string Name,
    string InviteCode,
    Guid CreatorUserId,
    decimal TotalCost,
    decimal? YourCost,
    Guid? ClaimedParticipantId,
    IEnumerable<GetSettlementQueryResultParticipant> Participants
);

public sealed record GetSettlementQueryResultParticipant(
    Guid Id,
    string Nickname,
    bool HasAnyExpenses
);
