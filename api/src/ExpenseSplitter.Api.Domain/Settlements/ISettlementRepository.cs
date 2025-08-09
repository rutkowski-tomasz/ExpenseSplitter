using ExpenseSplitter.Api.Domain.Users;

namespace ExpenseSplitter.Api.Domain.Settlements;

public interface ISettlementRepository
{
    void Add(Settlement settlement);
    void Remove(Settlement settlement);
    Task<Settlement?> GetById(SettlementId id, CancellationToken cancellationToken);
    Task<List<Settlement>> GetPaged(UserId userId, int page, int pageSize, CancellationToken cancellationToken);
    Task<SettlementPageResult> GetPagedWithCursor(UserId userId, string? cursor, int limit, CancellationToken cancellationToken);
    Task<Settlement?> GetByInviteCode(string inviteCode, CancellationToken cancellationToken);
}
