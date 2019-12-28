using System.Linq;
using System.Text.Json;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Infrastructure;
using ExpenseSplitter.Api.Models.Trips;
using ExpenseSplitter.Api.Services;
using ExpenseSplitter.Tests.Setup;
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

            _tripService = new TripService(_context, _userService.Object, uidGenerator);
        }

        [Test]
        public void ShouldReturnOnlyMyTrips()
        {
            // Arrange
            var user = _context.Users.First(x => x.Nick == "Andrew");
            _userService.Setup(x => x.GetCurrentUserId()).Returns(user.Id);

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
            _userService.Setup(x => x.GetCurrentUserId()).Returns(user.Id);

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
            _userService.Setup(x => x.GetCurrentUserId()).Returns(user.Id);

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
            _userService.Setup(x => x.GetCurrentUser()).Returns(user);

            var model = new CreateTripModel()
            {
                Name = "New trip",
                Description = "Description of the new awesome trip",
            };

            // Act
            var trip = _tripService.CreateTrip(model);

            // Assert
            Assert.IsNotNull(trip);
            Assert.AreEqual(1, trip.Users.Count);
            Assert.AreEqual(user.Id, trip.Users.First().UserId);
            Assert.AreEqual(1, trip.Participants.Count);
            Assert.AreEqual("Carol", trip.Participants.First().Name);
            Assert.AreEqual(user.Id, trip.Participants.First().UserId);
        }

        [Test]
        public void ShouldCorrectlyUpdateTrip()
        {
            // Arrange
            var user = _context.Users.First(x => x.Nick == "Andrew");
            _userService.Setup(x => x.GetCurrentUserId()).Returns(user.Id);
            
            var participation = _context.TripsParticipants.FirstOrDefault(x => x.UserId == user.Id && x.TripUid == "rome");

            var model = new UpdateTripModel
            {
                Uid = "rome",
                Name = "It was not trip to Rome",
                Description = "But still andrew took part in it",
                Participants = new System.Collections.Generic.List<UpdateTripModelParticipant>
                {
                    new UpdateTripModelParticipant
                    {
                        Id = participation.Id,
                        Name = "Custom nickname",
                    },
                    new UpdateTripModelParticipant
                    {
                        Name = "Ethan"
                    }
                },
            };

            // Act
            var trip = _tripService.UpdateTrip(model);

            // Assert
            Assert.NotNull(trip);
            Assert.AreEqual("It was not trip to Rome", trip.Name);
            Assert.AreEqual(3, trip.Participants.Count);
            Assert.AreEqual("Custom nickname", trip.Participants.First(x => x.UserId == user.Id).Name);
            Assert.IsNull(trip.Participants.First(x => x.Name == "Ethan").User);
            Assert.AreEqual(2, trip.Users.Count);
        }

        [Test]
        public void ShouldNotUpdateTripOfAnotherUser()
        {
            // Arrange
            var user = _context.Users.First(x => x.Nick == "Diana");
            _userService.Setup(x => x.GetCurrentUserId()).Returns(user.Id);

            var model = new UpdateTripModel
            {
                Uid = "rome",
                Name = "Changed name",
            };

            // Act
            var trip = _tripService.UpdateTrip(model);

            // Assert
            Assert.IsNull(trip);
        }

        [Test]
        public void ShouldJoinTrip()
        {
            // Arrange
            var user = _context.Users.First(x => x.Nick == "Diana");
            _userService.Setup(x => x.GetCurrentUserId()).Returns(user.Id);

            // Act
            var trip = _tripService.JoinTrip("rome");

            // Assert
            Assert.NotNull(trip);
            Assert.AreEqual(2, trip.Participants.Count);
            Assert.AreEqual(3, trip.Users.Count);
        }

        [Test]
        public void ShouldNotJoinTripTwoTimes()
        {
            // Arrange
            var user = _context.Users.First(x => x.Nick == "Diana");
            _userService.Setup(x => x.GetCurrentUserId()).Returns(user.Id);

            // Act
            var trip = _tripService.JoinTrip("berlin");

            // Assert
            Assert.NotNull(trip);
            Assert.AreEqual(3, trip.Participants.Count);
            Assert.AreEqual(3, trip.Users.Count);
        }

        [Test]
        public void ShouldNotJoinNotExistingTrip()
        {
            // Arrange
            var user = _context.Users.First(x => x.Nick == "Carol");
            _userService.Setup(x => x.GetCurrentUserId()).Returns(user.Id);

            // Act
            var trip = _tripService.JoinTrip("notexisting");

            // Assert
            Assert.Null(trip);
        }

        [Test]
        public void ShouldLeaveJoinedTrip()
        {
            // Arrange
            var user = _context.Users.First(x => x.Nick == "Bryan");
            _userService.Setup(x => x.GetCurrentUserId()).Returns(user.Id);

            // Act
            var trip = _tripService.LeaveTrip("rome");

            // Assert
            Assert.True(trip);
            Assert.AreEqual(1, _context.Trips.First(x => x.Uid == "rome").Users.Count);
        }

        [Test]
        public void ShouldNotLeaveOtherUsersTrip()
        {
            // Arrange
            var user = _context.Users.First(x => x.Nick == "Carol");
            _userService.Setup(x => x.GetCurrentUserId()).Returns(user.Id);

            // Act
            var trip = _tripService.LeaveTrip("rome");

            // Assert
            Assert.False(trip);
        }

        [Test]
        public void ShouldNotLeaveNotExistingTrip()
        {
            // Arrange
            var user = _context.Users.First(x => x.Nick == "Carol");
            _userService.Setup(x => x.GetCurrentUserId()).Returns(user.Id);

            // Act
            var trip = _tripService.LeaveTrip("notexisting");

            // Assert
            Assert.False(trip);
        }
    }
}