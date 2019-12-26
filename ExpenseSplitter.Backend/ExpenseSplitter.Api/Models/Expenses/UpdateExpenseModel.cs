
using System;
using System.Collections.Generic;
using ExpenseSplitter.Api.Data;

namespace ExpenseSplitter.Api.Models.Expenses
{
    public class UpdateExpenseModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ExpenseType Type { get; set; }
        public DateTime PaidAt { get; set; }
        public int PayerId { get; set; }

        public List<ExpensePart> Parts { get; set; }
    }
}
