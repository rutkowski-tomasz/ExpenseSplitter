
using System.ComponentModel.DataAnnotations;
using ExpenseSplitter.Api.Infrastructure;

namespace ExpenseSplitter.Api.Models.Trips
{
    public class TripCreateModel
    {
        [Required, MinLength(Constants.TripNameMinLength), MaxLength(Constants.TripNameMaxLength)]
        public string Name { get; set; }

        [MinLength(Constants.TripDescriptionMinLength), MaxLength(Constants.TripDescriptionMaxLength)]
        public string Description { get; set; }

        [Required, MinLength(Constants.ParticipantNameMinLength), MaxLength(Constants.ParticipantNameMaxLength)]
        public string OrganizerNick { get; set; }
    }
}
