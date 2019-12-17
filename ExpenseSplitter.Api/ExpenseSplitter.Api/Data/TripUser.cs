using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ExpenseSplitter.Api.Data
{
    public class TripUser
    {
        [Key] public int Id { get; set; }


        [JsonIgnore]
        public Trip Trip { get; set; }
        public User User { get; set; }

        [StringLength(60)]
        public string Name { get; set; }
    }
}
