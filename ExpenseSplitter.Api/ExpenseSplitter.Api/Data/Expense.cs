using System.ComponentModel.DataAnnotations;

namespace ExpenseSplitter.Api.Data
{
    public class Expense
    {
        [Key] public int Id { get; set; }

        public Trip Trip { get; set; }
        public User Adder { get; set; }
        public User Payer { get; set; }

        public string Name { get; set; }
        public ExpenseType Type { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime PaidAt { get; set; }
    }
}
