namespace ExpenseSplitter.Api.Application.Settlements.GetAllSettlements;

public sealed record GetAllSettlementsWithCursorQueryResult(
    IEnumerable<GetAllSettlementsQueryResultSettlement> Settlements,
    string? NextCursor,
    bool HasMore
);
