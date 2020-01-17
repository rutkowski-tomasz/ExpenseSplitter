
using System.Collections.Generic;
using System.Linq;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Extensions;
using ExpenseSplitter.Api.Models.Expenses;
using Microsoft.EntityFrameworkCore;

namespace ExpenseSplitter.Api.Services
{
    public interface IExpenseService
    {
        List<ExpenseListModel> GetExpenses(string uid);
        ExpenseDetailsModel GetExpense(string uid, int id);
        int CreateExpense(string uid, ExpenseUpdateModel model);
        bool TryUpdateExpense(string uid, ExpenseUpdateModel model);
        bool TryDeleteExpense(string uid, int id);
    }

    public class ExpenseService : IExpenseService
    {
        private readonly Context _context;
        private readonly IUserService _userService;
        private readonly IExpenseExtensions _expenseExtensions;

        public ExpenseService(
            Context context,
            IUserService userService,
            IExpenseExtensions expenseExtensions
        )
        {
            _context = context;
            _userService = userService;
            _expenseExtensions = expenseExtensions;
        }

        public List<ExpenseListModel> GetExpenses(string uid)
        {
            var userId = _userService.GetCurrentUserId();
            var expenses = _context
                .Expenses
                .Include(x => x.Payer)
                .ThenInclude(x => x.UsersClaimed)
                .Where(x => x.TripUid == uid && x.Trip.Users.Any(y => y.UserId == userId))
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new ExpenseListModel {
                    Id = x.Id,
                    Name = x.Name,
                    Type = x.Type,
                    PaidAt = x.PaidAt,
                    PayerName = x.Payer.Name,
                    IsPaidByMe = x.Payer.UsersClaimed.Any(y => y.Id == userId),
                    Value = x.Parts.Sum(x => x.Value),
                    ISpent = x
                        .Parts
                        .Where(
                            k => k.PartParticipants.Any(
                                l => l.Participant.UsersClaimed.Any(
                                    m => m.UserId == userId
                                )
                            )
                        )
                        .Sum(x => x.Value / x.PartParticipants.Count),
                })
                .ToList();

            return expenses;
        }

        public ExpenseDetailsModel GetExpense(string uid, int id)
        {
            var userId = _userService.GetCurrentUserId();
            var expense = _context
                .Expenses
                .Include(x => x.Parts)
                .ThenInclude(x => x.PartParticipants)
                .ThenInclude(x => x.Participant)
                .Where(x =>
                    x.TripUid == uid
                    && x.Id == id
                    && x.Trip.Users.Any(y => y.UserId == userId))
                .Select(x => _expenseExtensions.ToExpenseDetailsModel(x))
                .SingleOrDefault();

            return expense;
        }

        public int CreateExpense(string uid, ExpenseUpdateModel model)
        {
            var userId = _userService.GetCurrentUserId();
            var trip = _context
                .Trips
                .SingleOrDefault(x =>
                    x.Uid == uid
                    && x.Users.Any(y => y.UserId == userId));

            if (trip == null)
                return 0;

            var expense = new Expense();
            expense.TripUid = uid;
            expense.AdderId = userId;
            expense = _expenseExtensions.Update(expense, model);

            _context.Expenses.Add(expense);
            _context.SaveChanges();

            return expense.Id;
        }

        public bool TryUpdateExpense(string uid, ExpenseUpdateModel model)
        {
            var userId = _userService.GetCurrentUserId();
            var expense = _context
                .Expenses
                .Include(x => x.Parts)
                .FirstOrDefault(x =>
                    x.Trip.Uid == uid
                    && x.Id == model.Id.Value
                    && x.Trip.Users.Any(y => y.UserId == userId)
                );

            if (expense == null)
                return false;

            foreach (var part in expense.Parts.ToList())
                _context.ExpensesParts.Remove(part);

            expense = _expenseExtensions.Update(expense, model);
            _context.SaveChanges();

            return true;
        }

        public bool TryDeleteExpense(string uid, int id)
        {
            var userId = _userService.GetCurrentUserId();
            var expense = _context
                .Expenses
                .Include(x => x.Parts)
                .ThenInclude(x => x.PartParticipants)
                .SingleOrDefault(x =>
                    x.TripUid == uid
                    && x.Id == id
                    && x.Trip.Users.Any(y => y.UserId == userId)
                );

            if (expense == null)
                return false;

            _context.Expenses.Remove(expense);
            _context.SaveChanges();

            return true;
        }
    }
}