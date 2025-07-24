using ExpenseSplitter.Api.Domain.Settlements;
using ExpenseSplitter.Api.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace ExpenseSplitter.Api.Infrastructure.Repositories;

internal sealed class SettlementRepository(ApplicationDbContext dbContext)
    : Repository<Settlement, SettlementId>(dbContext), ISettlementRepository
{
    public Task<List<Settlement>> GetPaged(UserId userId, int page, int pageSize, CancellationToken cancellationToken)
    {
        var skip = (page - 1) * pageSize;

        return DbContext
            .Set<Settlement>()
            .Where(settlement => settlement.SettlementUsers.Any(settlementUser => settlementUser.UserId == userId))
            .OrderByDescending(x => x.UpdatedOnUtc)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public Task<Settlement?> GetByInviteCode(string inviteCode, CancellationToken cancellationToken)
    {
        return DbContext
            .Set<Settlement>()
            .SingleOrDefaultAsync(x => x.InviteCode == inviteCode, cancellationToken);
    }
}
