
using System.Collections.Generic;

namespace ExpenseSplitter.Api.Models.Balance
{
    public class BalanceResponseModel
    {
        public List<ParticipantBalance> ParticipantsBalance { get; set; }
        public List<SettleBalance> SettlesBalance { get; set; }
    }
}
