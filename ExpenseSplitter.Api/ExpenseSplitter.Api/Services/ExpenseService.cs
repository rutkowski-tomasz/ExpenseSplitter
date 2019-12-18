
using System.Collections.Generic;
using System.Linq;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Extensions;
using ExpenseSplitter.Api.Models.Expenses;

namespace ExpenseSplitter.Api.Services
{
    public interface IExpenseService
    {
        List<Expense> GetExpenses(string uid);
        Expense GetExpense(string uid, int id);
        Expense CreateExpense(string uid, CreateExpenseModel model);
        Expense UpdateExpense(string uid, UpdateExpenseModel model);
        bool TryDeleteExpense(string uid, int id);
    }

    public class ExpenseService : IExpenseService
    {
        private readonly Context _context;
        private readonly IUserService _userService;

        public ExpenseService(
            Context context,
            IUserService userService
        ) {
            _context = context;
            _userService = userService;
        }

        public List<Expense> GetExpenses(string uid)
        {
            var userId = _userService.GetCurrentUserId();
            var expenses = _context
                .Expenses
                .Where(x => x.TripUid == uid && x.Trip.Users.Any(y => y.UserId == userId))
                .OrderByDescending(x => x.CreatedAt)
                .ToList();

            return expenses;
        }

        public Expense GetExpense(string uid, int id)
        {
            var userId = _userService.GetCurrentUserId();
            var expense = _context
                .Expenses
                .SingleOrDefault(x =>
                    x.TripUid == uid
                    && x.Id == id
                    && x.Trip.Users.Any(y => y.UserId == userId));

            return expense;
        }

        public Expense CreateExpense(string uid, CreateExpenseModel model)
        {
            var userId = _userService.GetCurrentUserId();
            var trip = _context
                .Trips
                .SingleOrDefault(x =>
                    x.Uid == uid
                    && x.Users.Any(y => y.UserId == userId));

            if (trip == null)
                return null;

            var expense = new Expense().Create(model, uid, userId);

            _context.Expenses.Add(expense);
            _context.SaveChanges();

            return expense;
        }

        public Expense UpdateExpense(string uid, UpdateExpenseModel model)
        {
            var userId = _userService.GetCurrentUserId();
            var expense = _context
                .Expenses
                .SingleOrDefault(x =>
                    x.Trip.Uid == uid
                    && x.Id == model.Id
                    && x.Trip.Users.Any(y => y.UserId == userId));

            if (expense == null)
                return null;

            expense.Update(model);
            _context.SaveChanges();

            return expense;
        }

        public bool TryDeleteExpense(string uid, int id)
        {
            var userId = _userService.GetCurrentUserId();
            var expense = _context.Expenses.SingleOrDefault(x =>
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