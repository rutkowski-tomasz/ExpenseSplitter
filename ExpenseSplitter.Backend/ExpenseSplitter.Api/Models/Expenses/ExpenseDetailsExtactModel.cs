
using System;
using System.Collections.Generic;

namespace ExpenseSplitter.Api.Models.Expenses
{
    public class ExpenseDetailsExtactModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ExpenseType Type { get; set; }
        public DateTime PaidAt { get; set; }
        public int PayerId { get; set; }
        public decimal Value { get; set; }
        public List<ExpensePartModel> Parts { get; set; }
    }
}
