using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using ExpenseSplitter.Api.Infrastructure;

namespace ExpenseSplitter.Api.Data
{
    public class Participant
    {
        [Key] public int Id { get; set; }

        [StringLength(Constants.ParticipantNameMaxLength)]
        public string Name { get; set; }

        public string TripUid { get; set; }
        [JsonIgnore]
        public Trip Trip { get; set; }

        public virtual ICollection<TripUser> UsersClaimed { get; set; }
        public virtual ICollection<ExpensePartParticipant> ExpenseParticipations { get; set; }
    }
}
