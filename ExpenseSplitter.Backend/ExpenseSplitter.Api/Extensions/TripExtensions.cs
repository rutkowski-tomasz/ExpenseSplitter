using System.Collections.Generic;
using System.Linq;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Infrastructure;
using ExpenseSplitter.Api.Models.Trips;

namespace ExpenseSplitter.Api.Extensions
{
    public interface ITripExtensions
    {
        Trip Create(TripCreateModel model, int adderId);
        Trip Update(Trip trip, TripUpdateModel model);
        TripListModel ToTripListModel(Trip trip);
        TripDetailsModel ToTripDetailsModel(Trip trip);
    }

    public class TripExtensions : ITripExtensions
    {
        private readonly Context _context;
        private readonly IUidGenerator _uidGenerator;
        private readonly IParticipantExtensions _participantExtensions;

        public TripExtensions(
            Context context,
            IUidGenerator uidGenerator,
            IParticipantExtensions participantExtensions
        ) {
            _context = context;
            _uidGenerator = uidGenerator;
            _participantExtensions = participantExtensions;
        }

        public Trip Create(TripCreateModel model, int adderId)
        {
            var uid = _uidGenerator.Generate(
                Constants.UidGenerateLength,
                Constants.UidGenerateAllowDuplicates,
                generatedUid => _context.Trips.FirstOrDefault(y => y.Uid == generatedUid) != null
            );

            var trip = new Trip();
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
                    UserId = adderId,
                    TripUid = uid,
                    Participant = participant,
                }
            };

            return trip;
        }

        public Trip Update(Trip trip, TripUpdateModel model)
        {
            foreach (var participant in trip.Participants.ToList())
            {
                if (model.Participants.All(p => p.Id != participant.Id))
                    _context.TripsParticipants.Remove(participant);
            }

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

        public TripListModel ToTripListModel(Trip trip)
        {
            return new TripListModel
            {
                Uid = trip.Uid,
                Name = trip.Name,
                Description = trip.Description,
            };
        }

        public TripDetailsModel ToTripDetailsModel(Trip trip)
        {
            return new TripDetailsModel
            {
                Uid = trip.Uid,
                Name = trip.Name,
                Description = trip.Description,
                Participants = trip.Participants.Select(x => _participantExtensions.ToParticipantModel(x)).ToList()
            };
        }
    }
}
