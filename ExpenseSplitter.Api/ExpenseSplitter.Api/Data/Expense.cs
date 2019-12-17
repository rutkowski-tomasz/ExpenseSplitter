using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExpenseSplitter.Api.Data
{
    public class Expense
    {
        [Key] public int Id { get; set; }

        public Trip Trip { get; set; }
        public User Adder { get; set; }
        public User Payer { get; set; }

        [StringLength(50)]
        public string Name { get; set; }
        public ExpenseType Type { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime PaidAt { get; set; }
    }
}
