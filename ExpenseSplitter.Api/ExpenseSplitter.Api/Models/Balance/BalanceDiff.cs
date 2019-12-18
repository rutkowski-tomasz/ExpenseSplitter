
using ExpenseSplitter.Api.Data;

namespace ExpenseSplitter.Api.Models.Balance
{
    public class BalanceDiff
    {
        public decimal Diff { get; set; }
        public Participant Participant { get; set; }
    }
}
