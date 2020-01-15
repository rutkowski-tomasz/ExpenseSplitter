using System.Collections.Generic;
using System.Linq;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Models.Expenses;
using ExpenseSplitter.Api.Services;

namespace ExpenseSplitter.Api.Extensions
{
    public interface IExpenseExtensions
    {
        Expense Update(Expense expense, UpdateExpenseModel model);
        ExpenseDetailsExtactModel ToExpenseDetailsExtract(Expense expense);
    }

    public class ExpenseExtensions : IExpenseExtensions
    {
        private readonly Context _context;
        private readonly IUserService _userService;

        public ExpenseExtensions(
            Context context,
            IUserService userService
        ) {
            _context = context;
            _userService = userService;
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

        public ExpenseDetailsExtactModel ToExpenseDetailsExtract(Expense expense)
        {
            var userId = _userService.GetCurrentUserId();

            return new ExpenseDetailsExtactModel
            {
                Id = expense.Id,
                Name = expense.Name,
                Type = expense.Type,
                PaidAt = expense.PaidAt,
                PayerId = expense.PayerId,
                Value = expense.Parts.Sum(x => x.Value),
                Parts = expense.Parts.Select(x =>
                    new ExpensePartModel {
                        Value = x.Value,
                        ParticipantIds = x.PartParticipants.Select(x => x.ParticipantId).ToList()
                    }
                ).ToList(),
            };
        }
    }
}
