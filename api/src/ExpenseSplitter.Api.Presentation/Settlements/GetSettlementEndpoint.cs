using ExpenseSplitter.Api.Application.Settlements.GetSettlement;
using ExpenseSplitter.Api.Presentation.MediatrEndpoints;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseSplitter.Api.Presentation.Settlements;

public record GetSettlementRequest([FromRoute] Guid SettlementId);

public record GetSettlementResponse(
    Guid Id,
    string Name,
    string InviteCode,
    Guid CreatorUserId,
    decimal TotalCost,
    decimal? YourCost,
    Guid? ClaimedParticipantId,
    IEnumerable<GetSettlementResponseParticipant> Participants
);

public record GetSettlementResponseParticipant(
    Guid Id,
    string Nickname,
    bool HasAnyExpenses
);

public class GetSettlementEndpoint() : Endpoint<GetSettlementRequest, GetSettlementQuery, GetSettlementQueryResult, GetSettlementResponse>(
    Endpoints.Settlements.Get("{settlementId}").ProducesErrorCodes([
        StatusCodes.Status403Forbidden,
        StatusCodes.Status404NotFound,
        StatusCodes.Status304NotModified
    ]),
    request => new GetSettlementQuery(request.SettlementId),
    result => new GetSettlementResponse(
        result.Id,
        result.Name,
        result.InviteCode,
        result.CreatorUserId,
        result.TotalCost,
        result.YourCost,
        result.ClaimedParticipantId,
        result.Participants.Select(participant => new GetSettlementResponseParticipant(
            participant.Id,
            participant.Nickname,
            participant.HasAnyExpenses
        ))
    )
);
