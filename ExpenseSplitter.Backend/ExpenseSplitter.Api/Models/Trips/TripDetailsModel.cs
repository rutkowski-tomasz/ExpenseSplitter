using System.Collections.Generic;
using ExpenseSplitter.Api.Models.Participant;

namespace ExpenseSplitter.Api.Models.Trips
{
    public class TripDetailsModel
    {
        public string Uid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<ParticipantModel> Participants { get; set; }
    }
}
