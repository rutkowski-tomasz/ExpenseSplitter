using System;
using System.Collections.Generic;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Infrastructure;
using ExpenseSplitter.Api.Models.Trips;

namespace ExpenseSplitter.Api.Extensions
{
    public static class TripExtensions
    {
        public static Trip Create(this Trip trip, CreateTripModel model, int adderId)
        {
            trip.Uid = generateTripUid(Constants.UidLength);
            trip.Name = model.Name;
            trip.Description = model.Description;
            
            trip.Participants = new List<Participant>()
            {
                new Participant
                {
                    UserId = adderId,
                    Name = model.OrganizerName,
                }
            };

            return trip;
        }

        public static Trip Update(this Trip trip, UpdateTripModel model)
        {
            trip.Name = model.Name;
            trip.Description = model.Description;

            trip.Participants = model.Participants;

            return trip;
        }

        private static string generateTripUid(int length)
        {
            return Guid.NewGuid().ToString("N").Substring(0, length);
        }
    }
}
