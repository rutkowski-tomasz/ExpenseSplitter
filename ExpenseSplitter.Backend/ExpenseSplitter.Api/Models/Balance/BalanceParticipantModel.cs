namespace ExpenseSplitter.Api.Models.Balance
{
    public class BalanceParticipantModel
    {
        public decimal Value { get; set; }
        public string ParticipantNick { get; set; }
        public int ParticipantId { get; set; }
        public bool IsMyBalance { get; set; }
    }
}
