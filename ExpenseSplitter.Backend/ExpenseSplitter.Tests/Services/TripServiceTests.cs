using System.Linq;
using System.Text.Json;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Extensions;
using ExpenseSplitter.Api.Infrastructure;
using ExpenseSplitter.Api.Models.Trips;
using ExpenseSplitter.Api.Services;
using ExpenseSplitter.Tests.Extensions;
using ExpenseSplitter.Tests.Setup;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;

namespace ExpenseSplitter.Tests.Services
{
    public class UnitTests
    {
        private Mock<IUserService> _userService;
        private Context _context;

        private ITripService _tripService;

        [SetUp]
        public void Setup()
        {
            _context = ContextMock.SetupContext();
    
            _userService = new Mock<IUserService>();
            var uidGenerator = new UidGenerator();
            var participantExtensions = new ParticipantExtensions();
            var tripExtensions = new TripExtensions(_context, uidGenerator, participantExtensions);

            var logger = Mock.Of<ILogger<TripService>>();

            _tripService = new TripService(_context, _userService.Object, participantExtensions, tripExtensions, logger);
        }

        [Test]
        public void ShouldReturnOnlyMyTrips()
        {
            // Arrange
            var user = _context.Users.First(x => x.Nick == "Andrew");
            _userService.ImpersonateUser(user);

            // Act
            var trips = _tripService.GetTrips();

            // Assert
            Assert.AreEqual(1, trips.Count);
            Assert.True(trips.All(t => t.Uid != "berlin"));
        }

        [Test]
        public void ShouldGetDetailsForTrip()
        {
            // Arrange
            var user = _context.Users.First(x => x.Nick == "Bryan");
            _userService.ImpersonateUser(user);

            // Act
            var trip = _tripService.GetTrip("rome");

            // Assert
            Assert.IsNotNull(trip);
            Assert.AreEqual("2019 June trip to Rome", trip.Description);
        }

        [Test]
        public void ShouldNotGetDetailsForNotJoinedTrip()
        {
            // Arrange
            var user = _context.Users.First(x => x.Nick == "Diana");
            _userService.ImpersonateUser(user);

            // Act
            var trip = _tripService.GetTrip("rome");

            // Assert
            Assert.IsNull(trip);
        }

        [Test]
        public void ShouldCorrectlyCreateNewTrip()
        {
            // Arrange
            var user = _context.Users.First(x => x.Nick == "Carol");
            _userService.ImpersonateUser(user);

            var model = new TripCreateModel()
            {
                Name = "New trip",
                Description = "Description of the new awesome trip",
                OrganizerNick = "Crazy Carol",
            };

            // Act
            var result = _tripService.CreateTrip(model);

            // Assert
            Assert.IsNotNull(result);

            var trip = _context.Trips.SingleOrDefault(x => x.Uid == result);

            Assert.IsNotNull(trip);
            Assert.AreEqual(1, trip.Users.Count);
            Assert.AreEqual(user.Id, trip.Users.First().UserId);
            Assert.AreEqual(trip.Participants.First().Id, trip.Users.First().ParticipantId);
            Assert.AreEqual(1, trip.Participants.Count);
            Assert.AreEqual("Crazy Carol", trip.Participants.First().Name);
        }

        [Test]
        public void ShouldCorrectlyUpdateTrip()
        {
            // Arrange
            var user = _context.Users.First(x => x.Nick == "Andrew");
            _userService.ImpersonateUser(user);
            
            var participation = _context
                .TripsParticipants
                .FirstOrDefault(
                    x => x.UsersClaimed.Any(y => y.UserId == user.Id) &&
                    x.TripUid == "rome"
                );

            var model = new TripUpdateModel
            {
                Uid = "rome",
                Name = "It was not trip to Rome",
                Description = "But still andrew took part in it",
                Participants = new System.Collections.Generic.List<UpdateTripModelParticipant>
                {
                    new UpdateTripModelParticipant
                    {
                        Id = participation.Id,
                        Nick = "Custom nickname",
                    },
                    new UpdateTripModelParticipant
                    {
                        Nick = "Ethan"
                    }
                },
            };

            // Act
            var result = _tripService.TryUpdateTrip(model);

            // Assert
            Assert.IsTrue(result);

            var trip = _context.Trips.SingleOrDefault(x => x.Uid == model.Uid);
            Assert.NotNull(trip);
            Assert.AreEqual("It was not trip to Rome", trip.Name);
            Assert.AreEqual(2, trip.Participants.Count);
            Assert.AreEqual("Custom nickname", trip.Participants.First(x => x.Id == participation.Id).Name);

            var newParticipant = trip.Participants.First(x => x.Name == "Ethan");
            Assert.True(_context.TripsUsers.All(x => x.ParticipantId != newParticipant.Id));
            Assert.AreEqual(2, trip.Users.Count);
        }

        [Test]
        public void ShouldNotUpdateTripOfAnotherUser()
        {
            // Arrange
            var user = _context.Users.First(x => x.Nick == "Diana");
            _userService.ImpersonateUser(user);

            var model = new TripUpdateModel
            {
                Uid = "rome",
                Name = "Changed name",
            };

            // Act
            var result = _tripService.TryUpdateTrip(model);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void ShouldJoinTrip()
        {
            // Arrange
            var user = _context.Users.First(x => x.Nick == "Diana");
            _userService.ImpersonateUser(user);

            // Act
            var result = _tripService.TryJoinTrip("rome");

            // Assert
            Assert.IsTrue(result);

            var trip = _context.Trips.SingleOrDefault(x => x.Uid == "rome");
            Assert.NotNull(trip);
            Assert.AreEqual(2, trip.Participants.Count);
            Assert.AreEqual(3, trip.Users.Count);
        }

        [Test]
        public void ShouldNotJoinTripTwoTimes()
        {
            // Arrange
            var user = _context.Users.First(x => x.Nick == "Diana");
            _userService.ImpersonateUser(user);

            // Act
            var result = _tripService.TryJoinTrip("berlin");

            // Assert
            Assert.IsTrue(result);

            var trip = _context.Trips.SingleOrDefault(x => x.Uid == "berlin");
            Assert.NotNull(trip);
            Assert.AreEqual(3, trip.Participants.Count);
            Assert.AreEqual(3, trip.Users.Count);
        }

        [Test]
        public void ShouldNotJoinNotExistingTrip()
        {
            // Arrange
            var user = _context.Users.First(x => x.Nick == "Carol");
            _userService.ImpersonateUser(user);

            // Act
            var result = _tripService.TryJoinTrip("notexisting");

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void ShouldLeaveJoinedTrip()
        {
            // Arrange
            var user = _context.Users.First(x => x.Nick == "Bryan");
            _userService.ImpersonateUser(user);

            // Act
            var trip = _tripService.TryLeaveTrip("rome");

            // Assert
            Assert.True(trip);
            Assert.AreEqual(1, _context.Trips.First(x => x.Uid == "rome").Users.Count);
        }

        [Test]
        public void ShouldNotLeaveOtherUsersTrip()
        {
            // Arrange
            var user = _context.Users.First(x => x.Nick == "Carol");
            _userService.ImpersonateUser(user);

            // Act
            var trip = _tripService.TryLeaveTrip("rome");

            // Assert
            Assert.False(trip);
        }

        [Test]
        public void ShouldNotLeaveNotExistingTrip()
        {
            // Arrange
            var user = _context.Users.First(x => x.Nick == "Carol");
            _userService.ImpersonateUser(user);

            // Act
            var trip = _tripService.TryLeaveTrip("notexisting");

            // Assert
            Assert.False(trip);
        }
    }
}