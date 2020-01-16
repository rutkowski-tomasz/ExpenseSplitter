using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExpenseSplitter.Api.Models.Expenses
{
    public class ExpensePartModel
    {
        [Required, Range(0, 999999999999.99)]
        public decimal Value { get; set; }

        [Required, MinLength(1)]
        public List<int> ParticipantIds { get; set; }
    }
}