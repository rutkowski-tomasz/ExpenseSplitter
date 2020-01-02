namespace ExpenseSplitter.Api.Models.Balance
{
    public class BalanceDiff
    {
        public decimal Diff { get; set; }
        public string ParticipantNick { get; set; }
        public int ParticipantId { get; set; }
    }
}
