using ExpenseSplitter.Api.Application.Abstractions.Authentication;
using ExpenseSplitter.Api.Application.Abstractions.Cqrs;
using ExpenseSplitter.Api.Domain.Abstractions;
using ExpenseSplitter.Api.Domain.Settlements;
using ExpenseSplitter.Api.Domain.SettlementUsers;

namespace ExpenseSplitter.Api.Application.Settlements.LeaveSettlement;

public class LeaveSettlementCommandHandler(
    ISettlementUserRepository settlementUserRepository,
    ISettlementRepository settlementRepository,
    IUserContext userContext,
    IUnitOfWork unitOfWork
) : ICommandHandler<LeaveSettlementCommand>
{
    public async Task<Result> Handle(LeaveSettlementCommand request, CancellationToken cancellationToken)
    {
        var settlementId = new SettlementId(request.SettlemetId);
        var settlement = await settlementRepository.GetById(settlementId, cancellationToken);

        if (settlement is null)
        {
            return Result.Failure(SettlementErrors.NotFound);
        }

        var settlementUser = await settlementUserRepository.GetBySettlementId(settlementId, cancellationToken);
        if (settlementUser is null)
        {
            return SettlementErrors.Forbidden;
        }
        
        if (settlement.CreatorUserId == userContext.UserId)
        {
            return Result.Failure(SettlementErrors.Forbidden);
        }

        settlementUserRepository.Remove(settlementUser);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
