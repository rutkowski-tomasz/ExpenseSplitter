
using System;

namespace ExpenseSplitter.Api.Models.Expenses
{
    public class ExpenseExtractModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ExpenseType Type { get; set; }
        public DateTime PaidAt { get; set; }
        public string PayerName { get; set; }
        public bool IsPaidByMe { get; set; }
        public decimal Value { get; set; }
    }
}
