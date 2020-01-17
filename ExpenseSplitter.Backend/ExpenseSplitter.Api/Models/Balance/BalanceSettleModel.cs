
using ExpenseSplitter.Api.Data;

namespace ExpenseSplitter.Api.Models.Balance
{
    public class BalanceSettleModel
    {
        public decimal Value { get; set; }
        public string FromParticipantNick { get; set; }
        public int FromParticipantId { get; set; }
        public bool AmIFromParticipant { get; set; }
        public string ToParticipantNick { get; set; }
        public int ToParticipantId { get; set; }
        public bool AmIToParticipant { get; set; }
    }
}
