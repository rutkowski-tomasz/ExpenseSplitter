using ExpenseSplitter.Api.Application.Abstractions.Authentication;
using ExpenseSplitter.Api.Application.Abstractions.Cqrs;
using ExpenseSplitter.Api.Domain.Abstractions;
using ExpenseSplitter.Api.Domain.Expenses;
using ExpenseSplitter.Api.Domain.Participants;
using ExpenseSplitter.Api.Domain.Settlements;
using ExpenseSplitter.Api.Domain.SettlementUsers;

namespace ExpenseSplitter.Api.Application.Settlements.GetAllSettlements;

internal sealed class GetAllSettlementsWithCursorQueryHandler : IQueryHandler<GetAllSettlementsWithCursorQuery, GetAllSettlementsWithCursorQueryResult>
{
    private readonly ISettlementRepository settlementRepository;
    private readonly IExpenseRepository expenseRepository;
    private readonly ISettlementUserRepository settlementUserRepository;
    private readonly IUserContext userContext;

    public GetAllSettlementsWithCursorQueryHandler(
        ISettlementRepository settlementRepository,
        IExpenseRepository expenseRepository,
        ISettlementUserRepository settlementUserRepository,
        IUserContext userContext)
    {
        this.settlementRepository = settlementRepository;
        this.expenseRepository = expenseRepository;
        this.settlementUserRepository = settlementUserRepository;
        this.userContext = userContext;
    }

    public async Task<Result<GetAllSettlementsWithCursorQueryResult>> Handle(GetAllSettlementsWithCursorQuery query, CancellationToken cancellationToken)
    {
        var pagedResult = await settlementRepository.GetPagedWithCursor(userContext.UserId, query.Cursor, query.Limit, cancellationToken);
        
        var settlementResults = new List<GetAllSettlementsQueryResultSettlement>();
        
        foreach (var settlement in pagedResult.Items)
        {
            var settlementUser = await settlementUserRepository.GetBySettlementId(settlement.Id, cancellationToken);
            
            var expenses = await expenseRepository.GetAllBySettlementId(settlement.Id, cancellationToken);
            
            var totalExpenses = expenses.Sum(e => e.Amount.Value);
            
            var userBalance = CalculateUserBalance(expenses, settlementUser?.ParticipantId);
            
            var participantCount = settlement.Participants.Count;
            
            var lastActivity = settlement.UpdatedOnUtc;
            if (expenses.Any())
            {
                var latestExpenseDate = expenses.Max(e => e.LastModified);
                lastActivity = latestExpenseDate > lastActivity ? latestExpenseDate : lastActivity;
            }
            
            settlementResults.Add(new GetAllSettlementsQueryResultSettlement(
                settlement.Id.Value,
                settlement.Name,
                participantCount,
                totalExpenses,
                lastActivity,
                userBalance
            ));
        }

        var response = new GetAllSettlementsWithCursorQueryResult(
            settlementResults,
            pagedResult.NextCursor,
            pagedResult.HasMore);
            
        return Result.Success(response);
    }

    private static decimal CalculateUserBalance(IEnumerable<Expense> expenses, ParticipantId? userParticipantId)
    {
        if (userParticipantId is null)
        {
            return 0m;
        }

        var balance = 0m;
        
        foreach (var expense in expenses)
        {
            if (expense.PayingParticipantId == userParticipantId)
            {
                balance += expense.Amount.Value;
            }
            
            var userAllocation = expense.Allocations.FirstOrDefault(a => a.ParticipantId == userParticipantId);
            if (userAllocation is not null)
            {
                balance -= userAllocation.Amount.Value;
            }
        }

        return balance;
    }
}
