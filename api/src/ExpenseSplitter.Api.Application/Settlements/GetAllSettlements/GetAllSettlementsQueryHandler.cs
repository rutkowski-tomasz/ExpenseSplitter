using ExpenseSplitter.Api.Application.Abstractions.Authentication;
using ExpenseSplitter.Api.Application.Abstractions.Cqrs;
using ExpenseSplitter.Api.Domain.Abstractions;
using ExpenseSplitter.Api.Domain.Expenses;
using ExpenseSplitter.Api.Domain.Participants;
using ExpenseSplitter.Api.Domain.Settlements;
using ExpenseSplitter.Api.Domain.SettlementUsers;

namespace ExpenseSplitter.Api.Application.Settlements.GetAllSettlements;

internal sealed class GetSettlementsQueryHandler : IQueryHandler<GetAllSettlementsQuery, GetAllSettlementsQueryResult>
{
    private readonly ISettlementRepository settlementRepository;
    private readonly IExpenseRepository expenseRepository;
    private readonly ISettlementUserRepository settlementUserRepository;
    private readonly IUserContext userContext;

    public GetSettlementsQueryHandler(
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

    public async Task<Result<GetAllSettlementsQueryResult>> Handle(GetAllSettlementsQuery query, CancellationToken cancellationToken)
    {
        var settlements = await settlementRepository.GetPaged(userContext.UserId, query.Page, query.PageSize, cancellationToken);
        
        var settlementResults = new List<GetAllSettlementsQueryResultSettlement>();
        
        foreach (var settlement in settlements)
        {
            // Get user's participation in this settlement
            var settlementUser = await settlementUserRepository.GetBySettlementId(settlement.Id, cancellationToken);
            
            // Get all expenses for this settlement
            var expenses = await expenseRepository.GetAllBySettlementId(settlement.Id, cancellationToken);
            
            // Calculate total expenses
            var totalExpenses = expenses.Sum(e => e.Amount.Value);
            
            // Calculate user balance
            var userBalance = CalculateUserBalance(expenses, settlementUser?.ParticipantId);
            
            // Get participant count
            var participantCount = settlement.Participants.Count;
            
            // Use the most recent activity (settlement update time or latest expense)
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

        var response = new GetAllSettlementsQueryResult(settlementResults);
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
            // If user paid for this expense, they are owed money
            if (expense.PayingParticipantId == userParticipantId)
            {
                balance += expense.Amount.Value;
            }
            
            // Subtract the user's allocation (what they owe)
            var userAllocation = expense.Allocations.FirstOrDefault(a => a.ParticipantId == userParticipantId);
            if (userAllocation is not null)
            {
                balance -= userAllocation.Amount.Value;
            }
        }

        return balance;
    }
}
