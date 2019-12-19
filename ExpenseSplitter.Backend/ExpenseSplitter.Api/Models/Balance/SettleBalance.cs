
using ExpenseSplitter.Api.Data;

namespace ExpenseSplitter.Api.Models.Balance
{
    public class SettleBalance
    {
        public decimal Value { get; set; }
        public Participant FromParticipant { get; set; }
        public Participant ToParticipant { get; set; }
    }
}
