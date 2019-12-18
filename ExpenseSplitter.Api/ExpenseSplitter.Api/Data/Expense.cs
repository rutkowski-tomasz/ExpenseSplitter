using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using ExpenseSplitter.Api.Data.Entities;
using ExpenseSplitter.Api.Infrastructure;

namespace ExpenseSplitter.Api.Data
{
    public class Expense : CreatedAtEntity, UpdatedAtEntity
    {
        [Key] public int Id { get; set; }

        [StringLength(Constants.ExpenseNameLength)]
        public string Name { get; set; }
        public ExpenseType Type { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime PaidAt { get; set; }

        public string TripUid { get; set; }
        public Trip Trip { get; set; }
        public int AdderId { get; set; }
        public User Adder { get; set; }
        public int PayerId { get; set; }
        public User Payer { get; set; }

        public virtual ICollection<ExpensePart> Parts { get; set; }
    }
}
