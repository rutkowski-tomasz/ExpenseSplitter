using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExpenseSplitter.Api.Data
{
    public class TripUser
    {
        [Key] public int Id { get; set; }

        public Trip Trip { get; set; }
        public User User { get; set; }

        [StringLength(60)]
        public string Name { get; set; }
    }
}
