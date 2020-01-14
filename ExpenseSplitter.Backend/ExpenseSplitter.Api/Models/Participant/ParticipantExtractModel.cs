using System.Collections.Generic;

namespace ExpenseSplitter.Api.Models.Participant
{
    public class ParticipantExtractModel
    {
        public int Id { get; set; }
        public string Nick { get; set; }
        public List<int> ClaimedUserIds { get; set; }
    }
}
