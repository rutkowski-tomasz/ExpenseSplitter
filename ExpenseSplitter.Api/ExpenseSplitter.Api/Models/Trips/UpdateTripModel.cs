using System.Collections.Generic;
using ExpenseSplitter.Api.Data;

namespace ExpenseSplitter.Api.Models.Trips
{
    public class UpdateTripModel
    {
        public string Uid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public List<Participant> Participants { get; set; }
    }
}