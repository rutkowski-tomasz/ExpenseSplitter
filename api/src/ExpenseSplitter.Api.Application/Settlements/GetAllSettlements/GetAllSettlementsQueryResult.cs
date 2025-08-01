namespace ExpenseSplitter.Api.Application.Settlements.GetAllSettlements;

public sealed record GetAllSettlementsQueryResult(
    IEnumerable<GetAllSettlementsQueryResultSettlement> Settlements
);

public sealed record GetAllSettlementsQueryResultSettlement(
    Guid Id,
    string Name,
    int ParticipantCount,
    decimal TotalExpenses,
    DateTime LastActivity,
    decimal UserBalance
);
