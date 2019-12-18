using System;
using System.Collections.Generic;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Models.Trips;
using ExpenseSplitter.Api.Services;
using Moq;
using NUnit.Framework;

namespace ExpenseSplitter.Tests.Services
{
    public class UnitTests
    {
        private TripService _tripService;
        private Context _context;

        [SetUp]
        public void Setup()
        {
            var context = new Mock<Context>();

            var andrew = new User
            {
                Id = 1,
                Email = "andrew@test.pl",
                Password = "10000.e2qqDAlDe8QkqnY4/nN+gA==.XMtVShNIfCFmOl1rTTZYlLUCABZHDliYNaCoO+oI9mw=",
            };

            var bryan = new User
            {
                Id = 2,
                Email = "bryan@test.pl",
                Password = "10000.e2qqDAlDe8QkqnY4/nN+gA==.XMtVShNIfCFmOl1rTTZYlLUCABZHDliYNaCoO+oI9mw=",
            };

            var romeTrip = new Trip
            {
                Uid = "1234567890",
                Name = "Trip to Rome",
                Description = "2019 June trip to Rome",
                CreatedAt = DateTime.Now.AddDays(-1),
            };

            var andrewInRome = new TripUser {
                Id = 1,
                TripUid = "1234567890",
                Trip = romeTrip,
                UserId = andrew.Id,
                User = andrew,
            };

            var bryanInRome = new TripUser {
                Id = 2,
                TripUid = "1234567890",
                Trip = romeTrip,
                UserId = bryan.Id,
                User = bryan,
            };

            romeTrip.Users = new List<TripUser> { andrewInRome, bryanInRome };

            var berlinTrip = new Trip
            {
                Uid = "2345678901",
                Name = "Trip to Berlin",
                Description = "2018 December trip to Berlin",
                CreatedAt = DateTime.Now,
            };

            var bryanInBerlin = new TripUser {
                Id = 3,
                TripUid = "2345678901",
                Trip = berlinTrip,
                UserId = bryan.Id,
                User = bryan,
            };

            berlinTrip.Users = new List<TripUser> { bryanInBerlin };

            context.Setup(x => x.Users)
                .Returns(new FakeDbSet<User> { andrew, bryan });

            context.Setup(x => x.Trips)
                .Returns(new FakeDbSet<Trip> { romeTrip, berlinTrip});

            context.Setup(x => x.TripsUsers)
                .Returns(new FakeDbSet<TripUser> { andrewInRome, bryanInRome, bryanInBerlin });

            var userService = new Mock<IUserService>();
            userService.Setup(x => x.GetCurrentUserId()).Returns(andrew.Id);
            userService.Setup(x => x.GetCurrentUser()).Returns(andrew);

            _context = context.Object;
            _tripService = new TripService(context.Object, userService.Object);
        }

        [Test]
        public void ShouldReturnOnlyMyTrips()
        {
            var trips = _tripService.GetTrips();

            Assert.AreEqual(1, trips.Count);
        }

        [Test]
        public void ShouldGetDetailsForTrip()
        {
            var trip = _tripService.GetTrip("1234567890");

            Assert.IsNotNull(trip);
        }

        [Test]
        public void ShouldNotGetDetailsForNotJoinedTrip()
        {
            var trip = _tripService.GetTrip("2345678901");

            Assert.IsNull(trip);
        }
    }
}