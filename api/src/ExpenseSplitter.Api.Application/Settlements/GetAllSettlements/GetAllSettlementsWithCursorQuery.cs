using ExpenseSplitter.Api.Application.Abstractions.Cqrs;

namespace ExpenseSplitter.Api.Application.Settlements.GetAllSettlements;

public sealed record GetAllSettlementsWithCursorQuery(string? Cursor, int Limit) : IQuery<GetAllSettlementsWithCursorQueryResult>;
