using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Infrastructure;

namespace ExpenseSplitter.Api.Models.Trips
{
    public class TripUpdateModel
    {
        [Required]
        public string Uid { get; set; }

        [Required, MinLength(Constants.TripNameMinLength), MaxLength(Constants.TripNameMaxLength)]
        public string Name { get; set; }

        [MinLength(Constants.TripDescriptionMinLength), MaxLength(Constants.TripDescriptionMaxLength)]
        public string Description { get; set; }

        [Required, MinLength(1)]
        public List<UpdateTripModelParticipant> Participants { get; set; }
    }

    public class UpdateTripModelParticipant
    {
        [Required]
        public int Id { get; set; }

        [Required, MinLength(Constants.ParticipantNameMinLength), MaxLength(Constants.ParticipantNameMaxLength)]
        public string Nick { get; set; }
    }
}
