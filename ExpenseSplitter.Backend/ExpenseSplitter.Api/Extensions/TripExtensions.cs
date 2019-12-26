using System.Collections.Generic;
using System.Linq;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Models.Trips;

namespace ExpenseSplitter.Api.Extensions
{
    public static class TripExtensions
    {
        public static Trip Create(this Trip trip, CreateTripModel model, User adder, string uid)
        {
            trip.Uid = uid;
            trip.Name = model.Name;
            trip.Description = model.Description;

            trip.Participants = new List<Participant>()
            {
                new Participant
                {
                    UserId = adder.Id,
                    Name = adder.Nickname,
                }
            };

            trip.Users = new List<TripUser>()
            {
                new TripUser
                {
                    UserId = adder.Id,
                    TripUid = uid,
                }
            };

            return trip;
        }

        public static Trip Update(this Trip trip, UpdateTripModel model)
        {
            trip.Name = model.Name;
            trip.Description = model.Description;
    
            foreach (var participant in model.Participants)
            {
                if (!participant.Id.HasValue)
                    trip.Participants.Add(new Participant { Name = participant.Name });
                else
                {
                    var tripParticipant = trip.Participants.FirstOrDefault(x => x.Id == participant.Id.Value);

                    if (tripParticipant == null)
                        continue;

                    tripParticipant.Name = participant.Name;
                }
            }

            return trip;
        }
    }
}
