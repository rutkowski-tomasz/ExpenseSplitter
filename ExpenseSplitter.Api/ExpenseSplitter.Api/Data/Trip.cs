using System.ComponentModel.DataAnnotations;

namespace ExpenseSplitter.Api.Data
{
    public class Trip
    {
        [Key] public string Uid { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
