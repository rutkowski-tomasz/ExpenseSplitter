using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ExpenseSplitter.Api.Infrastructure;

namespace ExpenseSplitter.Api.Models.Expenses
{
    public class ExpensePartModel
    {
        [Required, Range(Constants.ExpenseValueMin, Constants.ExpenseValueMax)]
        public decimal Value { get; set; }

        [Required, MinLength(1)]
        public List<int> ParticipantIds { get; set; }
    }
}