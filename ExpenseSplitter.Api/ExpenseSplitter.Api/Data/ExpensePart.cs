using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ExpenseSplitter.Api.Infrastructure;

namespace ExpenseSplitter.Api.Data
{
    public class ExpensePart
    {
        [Key] public int Id { get; set; }

        [Column(TypeName = Constants.ExpenseValueType)]
        public decimal Value { get; set; }

        public int ExpenseId { get; set; }
        public Expense Expense { get; set; }

        public virtual ICollection<Participant> Participants { get; set; }
    }
}
