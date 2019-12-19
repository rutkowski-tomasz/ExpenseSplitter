


using System;
using System.Collections.Generic;
using System.Linq;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Extensions;
using ExpenseSplitter.Api.Infrastructure;
using ExpenseSplitter.Api.Models.Trips;
using Microsoft.EntityFrameworkCore;

namespace ExpenseSplitter.Api.Services
{
    public interface ITripService
    {
        List<Trip> GetTrips();
        Trip GetTrip(string uid);
        Trip CreateTrip(CreateTripModel model);
        Trip UpdateTrip(UpdateTripModel model);
        bool TryDeleteTrip(string uid);
        Trip JoinTrip(string uid);
        bool LeaveTrip(string uid);
        bool ClaimTripParticipation(string uid, int id);
    }

    public class TripService : ITripService
    {
        private readonly Context _context;
        private readonly IUserService _userService;
        private readonly IUidGenerator _uidGenerator;

        public TripService(
            Context context,
            IUserService userService,
            IUidGenerator uidGenerator
        ) {
            _context = context;
            _userService = userService;
            _uidGenerator = uidGenerator;
        }

        public List<Trip> GetTrips()
        {
            var userId = _userService.GetCurrentUserId();
            var trips = _context
                .Trips
                .Where(x => x.Users.Any(y => y.User.Id == userId))
                .OrderByDescending(x => x.CreatedAt)
                .Include(x => x.Participants);

            return trips.ToList();
        }

        public Trip GetTrip(string uid)
        {
            var userId = _userService.GetCurrentUserId();
            var trip = _context.Trips.SingleOrDefault(
                x => x.Uid == uid &&
                x.Users.Any(y => y.User.Id == userId)
            );

            return trip;
        }

        public Trip CreateTrip(CreateTripModel model)
        {
            var uid = _uidGenerator.Generate(
                Constants.UidGenerateLength,
                Constants.UidGenerateAllowDuplicates,
                generatedUid => _context.Trips.FirstOrDefault(y => y.Uid == generatedUid) != null
            );
            var trip = new Trip().Create(model, _userService.GetCurrentUserId(), uid);

            _context.Trips.Add(trip);
            _context.SaveChanges();

            return trip;
        }

        public Trip UpdateTrip(UpdateTripModel model)
        {
            var userId = _userService.GetCurrentUserId();
            var trip = _context.Trips.SingleOrDefault(
                x => x.Uid == model.Uid &&
                x.Users.Any(y => y.User.Id == userId)
            );

            if (trip == null)
                return null;

            trip.Update(model);
            _context.SaveChanges();

            return trip;
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

        public Trip JoinTrip(string uid)
        {
            var userId = _userService.GetCurrentUserId();
            var trip = _context.Trips.SingleOrDefault(x => x.Uid == uid);

            if (trip == null)
                return null;

            if (trip.Users.Any(x => x.User.Id == userId))
                return trip;

            trip.Users.Add(new TripUser
            {
                TripUid = uid,
                UserId = userId,
            });

            _context.SaveChanges();

            return trip;
        }

        public bool LeaveTrip(string uid)
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

        public bool ClaimTripParticipation(string uid, int id)
        {
            var userId = _userService.GetCurrentUserId();
            var trip = _context.Trips.SingleOrDefault(
                x => x.Uid == uid &&
                x.Users.Any(y => y.User.Id == userId)
            );

            if (trip == null)
                return false;

            var participant = trip.Participants.SingleOrDefault(x => x.Id == id);

            if (participant == null)
                return false;

            participant.UserId = userId;

            _context.SaveChanges();
            return true;
        }
    }
}