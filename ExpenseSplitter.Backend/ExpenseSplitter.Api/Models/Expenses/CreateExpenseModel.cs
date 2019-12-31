
using System;
using System.Collections.Generic;
using ExpenseSplitter.Api.Data;

namespace ExpenseSplitter.Api.Models.Expenses
{
    public class CreateExpenseModel
    {
        public string Name { get; set; }
        public ExpenseType Type { get; set; }
        public DateTime PaidAt { get; set; }
        public int PayerId { get; set; }

        public List<ExpensePartModel> Parts { get; set; }
    }
}
