using System.Collections.Generic;
using System.Linq;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Extensions;
using ExpenseSplitter.Api.Infrastructure;
using ExpenseSplitter.Api.Models.Participant;
using ExpenseSplitter.Api.Models.Trips;
using Microsoft.EntityFrameworkCore;

namespace ExpenseSplitter.Api.Services
{
    public interface ITripService
    {
        List<TripListModel> GetTrips();
        TripDetailsModel GetTrip(string uid);
        List<ParticipantModel> GetTripParticipants(string uid);
        string CreateTrip(TripCreateModel model);
        bool TryUpdateTrip(TripUpdateModel model);
        bool TryDeleteTrip(string uid);
        bool TryJoinTrip(string uid);
        bool TryLeaveTrip(string uid);
        bool TryClaimTripParticipation(string uid, int id);
        bool TripSetWhoAmI(string uid, int participantId);
    }

    public class TripService : ITripService
    {
        private readonly Context _context;
        private readonly IUserService _userService;
        private readonly IParticipantExtensions _participantExtensions;
        private readonly ITripExtensions _tripExtensions;

        public TripService(
            Context context,
            IUserService userService,
            IParticipantExtensions participantExtensions,
            ITripExtensions tripExtensions
        ) {
            _context = context;
            _userService = userService;
            _participantExtensions = participantExtensions;
            _tripExtensions = tripExtensions;
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
            var trip = _tripExtensions.Create(model, _userService.GetCurrentUserId());

            _context.Trips.Add(trip);
            _context.SaveChanges();

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

            return true;
        }

        public bool TryDeleteTrip(string uid)
        {
            var userId = _userService.GetCurrentUserId();
            var trip = _context.Trips.SingleOrDefault(
                x => x.Uid == uid &&
                x.Users.Any(y => y.User.Id == userId)
            );

            if (trip == null)
                return false;

            _context.Trips.Remove(trip);
            _context.SaveChanges();

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

            trip.Users.Add(new TripUser
            {
                TripUid = uid,
                UserId = userId,
            });

            _context.SaveChanges();

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
    }
}