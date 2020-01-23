using System.Collections.Generic;
using System.Linq;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Extensions;
using ExpenseSplitter.Api.Infrastructure;
using ExpenseSplitter.Api.Models.Participant;
using ExpenseSplitter.Api.Models.Trips;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace ExpenseSplitter.Api.Services
{
    public interface ITripService
    {
        List<TripListModel> GetTrips();
        TripDetailsModel GetTrip(string uid);
        List<ParticipantModel> GetTripParticipants(string uid);
        string CreateTrip(TripCreateModel model);
        bool TryUpdateTrip(TripUpdateModel model);
        bool TryJoinTrip(string uid);
        bool TryLeaveTrip(string uid);
        bool TryClaimTripParticipation(string uid, int id);
        bool TripSetWhoAmI(string uid, int participantId);
        bool TripCreateWhoAmI(string uid, string nick);
    }

    public class TripService : ITripService
    {
        private readonly Context _context;
        private readonly IUserService _userService;
        private readonly IParticipantExtensions _participantExtensions;
        private readonly ITripExtensions _tripExtensions;
        private readonly ILogger<TripService> _logger;

        public TripService(
            Context context,
            IUserService userService,
            IParticipantExtensions participantExtensions,
            ITripExtensions tripExtensions,
            ILogger<TripService> logger
        ) {
            _context = context;
            _userService = userService;
            _participantExtensions = participantExtensions;
            _tripExtensions = tripExtensions;
            _logger = logger;
        }

        public List<TripListModel> GetTrips()
        {
            var userId = _userService.GetCurrentUserId();
            var trips = _context
                .Trips
                .Where(x => x.Users.Any(y => y.User.Id == userId))
                .OrderByDescending(x => x.CreatedAt)
                .Include(x => x.Participants)
                .Select(x => _tripExtensions.ToTripListModel(x));

            return trips.ToList();
        }

        public TripDetailsModel GetTrip(string uid)
        {
            var userId = _userService.GetCurrentUserId();
            var trip = _context
                .Trips
                .Include(x => x.Participants)
                .ThenInclude(x => x.UsersClaimed)
                .Include(x => x.Participants)
                .ThenInclude(x => x.ExpenseParticipations)
                .Where(
                    x => x.Uid == uid &&
                    x.Users.Any(y => y.User.Id == userId)
                )
                .Select(x => _tripExtensions.ToTripDetailsModel(x))
                .SingleOrDefault();

            return trip;
        }

        public List<ParticipantModel> GetTripParticipants(string uid)
        {
            var userId = _userService.GetCurrentUserId();
            var participants = _context
                .TripsParticipants
                .Include(x => x.UsersClaimed)
                .Where(x => 
                    x.TripUid == uid 
                    && x.Trip.Users.Any(y => y.UserId == userId)
                )
                .Select(x => _participantExtensions.ToParticipantModel(x))
                .ToList();

            return participants;
        }

        public string CreateTrip(TripCreateModel model)
        {
            var userId = _userService.GetCurrentUserId();
            var trip = _tripExtensions.Create(model, userId);

            _context.Trips.Add(trip);
            _context.SaveChanges();

            _logger.LogInformation("User #{Id} created trip #{Uid}", userId, trip.Uid);
            return trip.Uid;
        }

        public bool TryUpdateTrip(TripUpdateModel model)
        {
            var userId = _userService.GetCurrentUserId();
            var trip = _context
                .Trips
                .Include(x => x.Participants)
                .SingleOrDefault(
                    x => x.Uid == model.Uid &&
                    x.Users.Any(y => y.User.Id == userId)
                );

            if (trip == null)
                return false;

            _tripExtensions.Update(trip, model);
            _context.SaveChanges();

            _logger.LogInformation("User #{Id} updated trip #{Uid}", userId, trip.Uid);
            return true;
        }

        public bool TryJoinTrip(string uid)
        {
            var userId = _userService.GetCurrentUserId();
            var trip = _context
                .Trips
                .Include(x => x.Users)
                .ThenInclude(x => x.User)
                .SingleOrDefault(x => x.Uid == uid);

            if (trip == null)
                return false;

            if (trip.Users.Any(x => x.User.Id == userId))
                return true;

            _context.TripsUsers.Add(new TripUser
            {
                TripUid = uid,
                UserId = userId,
            });

            _context.SaveChanges();

            _logger.LogInformation("User #{Id} joined trip #{Uid}", userId, trip.Uid);
            return true;
        }

        public bool TryLeaveTrip(string uid)
        {
            var userId = _userService.GetCurrentUserId();
            var tripUser = _context.TripsUsers.SingleOrDefault(
                x => x.TripUid == uid &&
                x.UserId == userId
            );

            if (tripUser == null)
                return false;

            _context.TripsUsers.Remove(tripUser);
            _context.SaveChanges();

            _logger.LogInformation("User #{Id} left trip #{Uid}", userId, uid);
            return true;
        }

        public bool TryClaimTripParticipation(string uid, int id)
        {
            var userId = _userService.GetCurrentUserId();
            var tripUser = _context
                .TripsUsers
                .SingleOrDefault(x =>
                    x.TripUid == uid &&
                    x.UserId == userId
                );

            if (tripUser == null)
                return false;

            var participant = _context
                .TripsParticipants
                .SingleOrDefault(x => x.Id == id && x.TripUid == uid);

            if (participant == null)
                return false;

            tripUser.ParticipantId = participant.Id;

            _context.SaveChanges();

            _logger.LogInformation("User #{Id} claimed trip #{Uid} participant {participantId}", userId, uid, participant.Id);
            return true;
        }

        public bool TripSetWhoAmI(string uid, int participantId)
        {
            var userId = _userService.GetCurrentUserId();
            var tripUser = _context
                .TripsUsers
                .SingleOrDefault(x =>
                    x.TripUid == uid &&
                    x.UserId == userId
                );

            if (tripUser == null)
                return false;

            tripUser.ParticipantId = participantId;
            _context.SaveChanges();
            return true;
        }

        public bool TripCreateWhoAmI(string uid, string nick)
        {
            var userId = _userService.GetCurrentUserId();
            var tripUser = _context
                .TripsUsers
                .SingleOrDefault(x =>
                    x.TripUid == uid &&
                    x.UserId == userId
                );

            if (tripUser == null)
                return false;

            tripUser.Participant = new Participant
            {
                Name = nick,
                TripUid = uid,
            };

            _context.SaveChanges();
            return true;
        }
    }
}
