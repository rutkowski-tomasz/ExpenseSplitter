using System.Collections.Generic;
using System.Linq;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Models.Expenses;

namespace ExpenseSplitter.Api.Extensions
{
    public interface IExpenseExtensions
    {
        Expense Update(Expense expense, UpdateExpenseModel model);
    }

    public class ExpenseExtensions : IExpenseExtensions
    {
        private readonly Context _context;

        public ExpenseExtensions(Context context)
        {
            _context = context;
        }

        public Expense Update(Expense expense, UpdateExpenseModel model)
        {
            expense.Name = model.Name;
            expense.Type = model.Type;
            expense.PaidAt = model.PaidAt;

            expense.PayerId = model.PayerId;
            expense.Parts = new List<ExpensePart>();

            foreach (var part in model.Parts)
            {
                var expensePart = new ExpensePart
                {
                    Value = part.Value,
                    PartParticipants = part. ParticipantIds.Select(id => new ExpensePartParticipant {
                        ParticipantId = id
                    }).ToList(),
                };

                expense.Parts.Add(expensePart);
            }

            return expense;
        }
    }
}
