using ExpenseSplitter.Api.Domain.Abstractions;
using ExpenseSplitter.Api.Domain.Settlements;
using ExpenseSplitter.Api.Domain.SettlementUsers;

namespace ExpenseSplitter.Api.Domain.Participants;

public sealed class Participant : Entity<ParticipantId>
{
    private readonly List<SettlementUser> settlementUsers = [];

    private Participant(
        ParticipantId id,
        SettlementId settlementId,
        string nickname
    ) : base(id)
    {
        SettlementId = settlementId;
        Nickname = nickname;
    }

    public SettlementId SettlementId { get; private set; }

    public string Nickname { get; private set; }

    public IReadOnlyList<SettlementUser> SettlementUsers => settlementUsers.AsReadOnly();

    internal static Result<Participant> Create(SettlementId settlementId, string nickname)
    {
        if (string.IsNullOrWhiteSpace(nickname))
        {
            return Result.Failure<Participant>(ParticipantErrors.NicknameEmpty);
        }

        var participant = new Participant(
            ParticipantId.New(),
            settlementId,
            nickname
        );

        return participant;
    }

    public Result SetNickname(string nickname)
    {
        if (string.IsNullOrWhiteSpace(nickname))
        {
            return Result.Failure(ParticipantErrors.NicknameEmpty);
        }

        Nickname = nickname;
        return Result.Success();
    }
}
