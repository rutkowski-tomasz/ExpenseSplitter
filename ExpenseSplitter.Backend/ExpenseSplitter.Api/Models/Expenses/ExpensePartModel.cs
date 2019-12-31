using System.Collections.Generic;

namespace ExpenseSplitter.Api.Models.Expenses
{
    public class ExpensePartModel
    {
        public decimal Value { get; set; }
        public List<int> ParticipantIds { get; set; }
    }
}