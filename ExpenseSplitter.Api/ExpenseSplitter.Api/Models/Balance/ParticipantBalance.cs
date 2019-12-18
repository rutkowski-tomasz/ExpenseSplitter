
using ExpenseSplitter.Api.Data;

namespace ExpenseSplitter.Api.Models.Balance
{
    public class ParticipantBalance
    {
        public decimal Value { get; set; }
        public Participant Participant { get; set; }
    }
}
