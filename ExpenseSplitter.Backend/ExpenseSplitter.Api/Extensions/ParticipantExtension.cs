using System.Linq;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Models.Participant;

namespace ExpenseSplitter.Api.Extensions
{
    public static class ParticipantExtensions
    {
        public static ParticipantExtractModel ToParticipantExtract(this Participant participant)
        {
            return new ParticipantExtractModel
            {
                Id = participant.Id,
                Nick = participant.Name,
                ClaimedUserIds = participant.UsersClaimed.Select(x => x.UserId).ToList(),
            };
        }
    }
}
