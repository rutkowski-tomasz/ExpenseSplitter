using System.Linq;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Models.Participant;

namespace ExpenseSplitter.Api.Extensions
{
    public interface IParticipantExtensions
    {
        ParticipantModel ToParticipantModel(Participant participant);
    }

    public class ParticipantExtensions : IParticipantExtensions
    {
        public ParticipantModel ToParticipantModel(Participant participant)
        {
            return new ParticipantModel
            {
                Id = participant.Id,
                Nick = participant.Name,
                HasAnyExpenses = participant.ExpenseParticipations.Count > 0,
                ClaimedUserIds = participant.UsersClaimed.Select(x => x.UserId).ToList(),
            };
        }
    }
}
