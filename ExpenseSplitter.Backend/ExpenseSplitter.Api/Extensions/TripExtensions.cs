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

            var participant = new Participant
            {
                Name = model.OrganizerNick,
            };

            trip.Participants = new List<Participant>() { participant };

            trip.Users = new List<TripUser>()
            {
                new TripUser
                {
                    UserId = adder.Id,
                    TripUid = uid,
                    Participant = participant,
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
                if (participant.Id == 0)
                    trip.Participants.Add(new Participant { Name = participant.Nick });
                else
                {
                    var tripParticipant = trip.Participants.FirstOrDefault(x => x.Id == participant.Id);

                    if (tripParticipant == null)
                        continue;

                    tripParticipant.Name = participant.Nick;
                }
            }

            return trip;
        }
    }
}
