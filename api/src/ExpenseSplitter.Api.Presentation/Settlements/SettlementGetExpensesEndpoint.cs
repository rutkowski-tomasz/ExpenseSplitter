using ExpenseSplitter.Api.Application.Expenses.GetExpensesForSettlement;
using ExpenseSplitter.Api.Presentation.MediatrEndpoints;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseSplitter.Api.Presentation.Settlements;

public record GetExpensesForSettlementRequest([FromRoute] Guid SettlementId);

public sealed record GetExpensesForSettlementResponse(
    IEnumerable<GetExpensesForSettlementResponseExpense> Expenses
);

public sealed record GetExpensesForSettlementResponseExpense(
    Guid Id,
    string Title,
    decimal Amount,
    Guid PayingParticipantId,
    DateOnly PaymentDate
);

public class SettlementGetExpensesEndpoint() : Endpoint<GetExpensesForSettlementRequest, GetExpensesForSettlementQuery, GetExpensesForSettlementQueryResult, GetExpensesForSettlementResponse>(
    Endpoints.Settlements.Get("{settlementId}/expenses").ProducesErrorCodes([
        StatusCodes.Status403Forbidden,
        StatusCodes.Status404NotFound
    ]),
    request => new GetExpensesForSettlementQuery(request.SettlementId),
    result => new GetExpensesForSettlementResponse(
        result.Expenses.Select(expense => new GetExpensesForSettlementResponseExpense(
            expense.Id,
            expense.Title,
            expense.Amount,
            expense.PayingParticipantId,
            expense.PaymentDate
        ))
    )
);
