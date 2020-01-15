using System.Collections.Generic;
using ExpenseSplitter.Api.Data;

namespace ExpenseSplitter.Api.Models.Trips
{
    public class TripUpdateModel
    {
        public string Uid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public List<UpdateTripModelParticipant> Participants { get; set; }
    }

    public class UpdateTripModelParticipant
    {
        public int Id { get; set; }
        public string Nick { get; set; }
    }
}
