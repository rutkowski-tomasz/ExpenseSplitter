using System.Collections.Generic;
using ExpenseSplitter.Api.Models.Participant;

namespace ExpenseSplitter.Api.Models.Trips
{
    public class TripDetailsExtract
    {
        public string Uid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<ParticipantExtractModel> Participants { get; set; }
    }
}
