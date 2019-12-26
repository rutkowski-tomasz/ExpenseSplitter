using System.ComponentModel.DataAnnotations;

namespace ExpenseSplitter.Api.Data
{
    public class TripUser
    {
        [Key] public int Id { get; set; }

        public string TripUid { get; set; }
        public Trip Trip { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}
