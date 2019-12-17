


using System;
using System.Collections.Generic;
using System.Linq;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace ExpenseSplitter.Api.Services
{
    public interface ITripService
    {
        List<Trip> GetTrips();
        Trip GetTrip(string uid);
        Trip CreateTrip(string name, string description, string organizerName);
        bool TryDeleteTrip(string uid);
    }

    public class TripService : ITripService
    {
        private readonly Context _context;
        private readonly IUserService _userService;

        public TripService(
            Context context,
            IUserService userService
        ) {
            _context = context;
            _userService = userService;
        }

        public List<Trip> GetTrips()
        {
            var userId = _userService.GetCurrentUserId();
            var trips = _context
                .Trips
                .Where(x => x.TripUsers.Any(y => y.User.Id == userId))
                .OrderByDescending(x => x.CreatedAt)
                .Include(x => x.TripUsers);

            return trips.ToList();
        }

        public Trip GetTrip(string uid)
        {
            var userId = _userService.GetCurrentUserId();
            var trip = _context.Trips.SingleOrDefault(
                x => x.Uid == uid &&
                x.TripUsers.Any(y => y.User.Id == userId)
            );

            return trip;
        }

        public Trip CreateTrip(string name, string description, string organizerName)
        {
            var trip = new Trip
            {
                Uid = generateTripUid(Constants.UidLength),
                Name = name,
                Description = description,
                TripUsers = new List<TripUser>(),
            };

            trip.TripUsers.Add(new TripUser
            {
                User = _userService.GetCurrentUser(),
                Name = organizerName,
            });

            _context.Trips.Add(trip);
            _context.SaveChanges();

            return trip;
        }

        public bool TryDeleteTrip(string uid)
        {
            var userId = _userService.GetCurrentUserId();
            var trip = _context.Trips.SingleOrDefault(
                x => x.Uid == uid &&
                x.TripUsers.Any(y => y.User.Id == userId)
            );

            if (trip == null)
                return false;
            
            _context.Trips.Remove(trip);
            _context.SaveChanges();

            return true;
        }

        private string generateTripUid(int length)
        {
            return Guid.NewGuid().ToString("N").Substring(0, length);
        }
    }
}