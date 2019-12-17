using System.ComponentModel.DataAnnotations;

namespace ExpenseSplitter.Api.Data
{
    public class ExpensePart
    {
        [Key] public int Id { get; set; }

        public Expense Expense { get; set; }

        public decimal Value { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
