
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Infrastructure;

namespace ExpenseSplitter.Api.Models.Expenses
{
    public class ExpenseUpdateModel
    {
        public int? Id { get; set; }

        [Required, MinLength(Constants.ExpenseNameMinLength), MaxLength(Constants.ExpenseNameMaxLength)]
        public string Name { get; set; }

        [Required]
        public ExpenseType Type { get; set; }

        [Required]
        public DateTime PaidAt { get; set; }

        [Required]
        public int PayerId { get; set; }

        [Required, MinLength(1)]
        public List<ExpensePartModel> Parts { get; set; }
    }
}
