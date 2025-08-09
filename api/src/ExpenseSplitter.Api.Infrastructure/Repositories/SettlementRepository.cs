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

    public async Task<SettlementPageResult> GetPagedWithCursor(UserId userId, string? cursor, int limit, CancellationToken cancellationToken)
    {
        if (limit < 1)
        {
            throw new ArgumentException("Limit must be greater than 0", nameof(limit));
        }
        
        if (limit > 100)
        {
            throw new ArgumentException("Limit must be less than or equal to 100", nameof(limit));
        }

        var query = DbContext
            .Set<Settlement>()
            .Where(settlement => settlement.SettlementUsers.Any(settlementUser => settlementUser.UserId == userId));

        var decodedCursor = SettlementCursor.Decode(cursor);
        if (decodedCursor is not null)
        {
            var cursorDate = decodedCursor.UpdatedOnUtc;
            
            query = query.Where(x => x.UpdatedOnUtc < cursorDate);
        }

        var items = await query
            .OrderByDescending(x => x.UpdatedOnUtc)
            .ThenByDescending(x => x.Id)
            .Take(limit + 1)
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > limit;
        string? nextCursor = null;

        if (hasMore)
        {
            var lastItem = items[^1];
            nextCursor = SettlementCursor.Encode(lastItem.UpdatedOnUtc);
            items.RemoveAt(items.Count - 1);
        }

        return new SettlementPageResult(items, nextCursor, hasMore);
    }

    public Task<Settlement?> GetByInviteCode(string inviteCode, CancellationToken cancellationToken)
    {
        return DbContext
            .Set<Settlement>()
            .SingleOrDefaultAsync(x => x.InviteCode == inviteCode, cancellationToken);
    }
}
