
using ExpenseSplitter.Api.Data;

namespace ExpenseSplitter.Api.Models.Balance
{
    public class SettleBalance
    {
        public decimal Value { get; set; }
        public string FromParticipantNick { get; set; }
        public int FromParticipantId { get; set; }
        public string ToParticipantNick { get; set; }
        public int ToParticipantId { get; set; }
    }
}
