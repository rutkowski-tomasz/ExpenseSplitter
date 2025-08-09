using ExpenseSplitter.Api.Application.Settlements.GetAllSettlements;
using ExpenseSplitter.Api.Presentation.MediatrEndpoints;

namespace ExpenseSplitter.Api.Presentation.Settlements;

public record GetAllSettlementsWithCursorRequest(string? Cursor, int Limit);

public record GetAllSettlementsWithCursorResponse(
    IEnumerable<GetAllSettlementsResponseSettlement> Settlements,
    string? NextCursor,
    bool HasMore
);

public class GetAllSettlementsWithCursorEndpoint() : Endpoint<GetAllSettlementsWithCursorRequest, GetAllSettlementsWithCursorQuery, GetAllSettlementsWithCursorQueryResult, GetAllSettlementsWithCursorResponse>(
    Endpoints.Settlements.Get("cursor"),
    request => new GetAllSettlementsWithCursorQuery(request.Cursor, request.Limit),
    result => new GetAllSettlementsWithCursorResponse(
        result.Settlements.Select(settlement => new GetAllSettlementsResponseSettlement(
            settlement.Id,
            settlement.Name,
            settlement.ParticipantCount,
            settlement.TotalExpenses,
            settlement.LastActivity,
            settlement.UserBalance
        )),
        result.NextCursor,
        result.HasMore
    )
);
