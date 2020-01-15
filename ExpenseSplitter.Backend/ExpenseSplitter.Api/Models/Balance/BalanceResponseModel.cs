
using System.Collections.Generic;

namespace ExpenseSplitter.Api.Models.Balance
{
    public class BalanceModel
    {
        public List<BalanceParticipantModel> ParticipantsBalance { get; set; }
        public List<BalanceSettleModel> SettlesBalance { get; set; }
    }
}
