using System.ComponentModel.DataAnnotations;

namespace ExpenseSplitter.Api.Data
{
    public class ExpensePartParticipant
    {
        [Key] public int Id { get; set; }

        public int ExpensePartId { get; set; }
        public ExpensePart ExpensePart { get; set; }
        public int ParticipantId { get; set; }
        public Participant Participant { get; set; }
    }
}
