namespace ExpenseSplitter.Api.Domain.Settlements;

public sealed record SettlementPageResult(
    List<Settlement> Items,
    string? NextCursor,
    bool HasMore);
