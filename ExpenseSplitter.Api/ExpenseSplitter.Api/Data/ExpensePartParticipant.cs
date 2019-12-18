using System.ComponentModel.DataAnnotations;

namespace ExpenseSplitter.Api.Data
{
    public class ExpensePartParticipant
    {
        [Key] public int Id { get; set; }

        public int ExpenseId { get; set; }
        public Expense Expense { get; set; }
        public int ParticipantId { get; set; }
        public Participant Participant { get; set; }
    }
}
