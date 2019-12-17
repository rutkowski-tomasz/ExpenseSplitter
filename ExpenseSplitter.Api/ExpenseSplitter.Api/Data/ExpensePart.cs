using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExpenseSplitter.Api.Data
{
    public class ExpensePart
    {
        [Key] public int Id { get; set; }

        public Expense Expense { get; set; }

        [Column(TypeName = "decimal(12, 2)")]
        public decimal Value { get; set; }
        

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
