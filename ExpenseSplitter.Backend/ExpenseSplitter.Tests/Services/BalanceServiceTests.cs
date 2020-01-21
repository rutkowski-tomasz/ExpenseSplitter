using System.Collections.Generic;
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
    public class BalanceServiceTests
    {
        private Mock<IUserService> _userService;
        private Context _context;

        private IBalanceService _balanceService;

        [SetUp]
        public void Setup()
        {
            _context = ContextMock.SetupContext();
            _userService = new Mock<IUserService>();

            _balanceService = new BalanceService(_context, _userService.Object);
        }

        [Test]
        public void ShouldCorrectlyCalculateBalanceFromMultiPartExpenses()
        {
            // Arrange
            var user = _context.Users.First(x => x.Nick == "Andrew");
            _userService.ImpersonateUser(user);

            var trip = _context.Trips.SingleOrDefault(x => x.Uid == "rome");
            var andrewParticipant = trip.Participants.FirstOrDefault(x => x.UsersClaimed.Any(y => y.UserId == user.Id));
            var bryanParticipant = trip.Participants.FirstOrDefault(x => x.UsersClaimed.Any(y => y.User.Nick == "Bryan"));

            _context.Expenses.Add(
                new Expense {
                    Name = "Expense A",
                    Type = ExpenseType.Expense,
                    TripUid = trip.Uid,
                    AdderId = user.Id,
                    PayerId = andrewParticipant.Id,
                    Parts = new List<ExpensePart>() {
                        new ExpensePart {
                            Value = 12.0M,
                            PartParticipants = new List<ExpensePartParticipant>() {
                                new ExpensePartParticipant() {
                                    ParticipantId = andrewParticipant.Id,
                                },
                                new ExpensePartParticipant() {
                                    ParticipantId = bryanParticipant.Id,
                                },
                            },
                        },
                    },
                }
            );
            _context.SaveChanges();

            // Act
            var balance = _balanceService.GetTripBalance(trip.Uid);

            // Assert
            Assert.NotNull(balance);
            Assert.AreEqual(balance.ParticipantsBalance.Count, 2);

            var andrewBalance = balance.ParticipantsBalance.FirstOrDefault(x => x.ParticipantId == andrewParticipant.Id);
            Assert.AreEqual(6.0M, andrewBalance.Value);
            Assert.True(andrewBalance.IsMyBalance);

            var bryanBalance = balance.ParticipantsBalance.FirstOrDefault(x => x.ParticipantId == bryanParticipant.Id);
            Assert.AreEqual(-6.0M, bryanBalance.Value);
            Assert.False(bryanBalance.IsMyBalance);

            Assert.AreEqual(1, balance.SettlesBalance.Count);

            var settlement = balance.SettlesBalance[0];
            Assert.AreEqual(andrewParticipant.Id, settlement.ToParticipantId);
            Assert.AreEqual(bryanParticipant.Id, settlement.FromParticipantId);
            Assert.AreEqual(6.0M, settlement.Value);


            var a = 2;
        }
    }
}