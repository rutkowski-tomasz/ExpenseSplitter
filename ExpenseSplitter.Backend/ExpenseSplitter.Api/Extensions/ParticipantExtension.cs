using System.Linq;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Models.Participant;

namespace ExpenseSplitter.Api.Extensions
{
    public interface IParticipantExtensions
    {
        ParticipantExtractModel ToParticipantExtract(Participant participant);
    }

    public class ParticipantExtensions : IParticipantExtensions
    {
        public ParticipantExtractModel ToParticipantExtract(Participant participant)
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
