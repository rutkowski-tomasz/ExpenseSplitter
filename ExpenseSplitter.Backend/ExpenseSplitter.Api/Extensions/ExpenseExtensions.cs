using System.Collections.Generic;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Models.Expenses;

namespace ExpenseSplitter.Api.Extensions
{
    public static class ExpenseExtensions
    {
        public static Expense Create(this Expense expense, CreateExpenseModel model, string uid, int adderId)
        {


            return expense;
        }

        public static Expense Update(this Expense expense, UpdateExpenseModel model)
        {
            expense.Name = model.Name;
            expense.Type = model.Type;
            expense.PaidAt = model.PaidAt;

            expense.PayerId = model.PayerId;
            expense.Parts = model.Parts;

            return expense;
        }
    }
}
