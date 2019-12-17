using System.ComponentModel.DataAnnotations;

namespace ExpenseSplitter.Api.Data
{
    public class ExpensePartUser
    {
        [Key] public int Id { get; set; }

        public Expense Expense { get; set; }
        public User User { get; set; }
    }
}
