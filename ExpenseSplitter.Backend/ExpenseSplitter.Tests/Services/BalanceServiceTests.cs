using System.Collections.Generic;
using System.Linq;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Services;
using ExpenseSplitter.Tests.Extensions;
using ExpenseSplitter.Tests.Setup;
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
                        this.CreateExpensePart(12.0M, andrewParticipant.Id, bryanParticipant.Id),
                        this.CreateExpensePart(8.0M, bryanParticipant.Id, andrewParticipant.Id),
                        this.CreateExpensePart(2.0M, bryanParticipant.Id),
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
            Assert.AreEqual(12.0M, andrewBalance.Value);
            Assert.True(andrewBalance.IsMyBalance);

            var bryanBalance = balance.ParticipantsBalance.FirstOrDefault(x => x.ParticipantId == bryanParticipant.Id);
            Assert.AreEqual(-12.0M, bryanBalance.Value);
            Assert.False(bryanBalance.IsMyBalance);

            Assert.AreEqual(1, balance.SettlesBalance.Count);

            var settlement = balance.SettlesBalance[0];
            Assert.AreEqual(andrewParticipant.Id, settlement.ToParticipantId);
            Assert.True(settlement.AmIToParticipant);
            Assert.AreEqual(bryanParticipant.Id, settlement.FromParticipantId);
            Assert.False(settlement.AmIFromParticipant);
            Assert.AreEqual(12.0M, settlement.Value);
        }

        [Test]
        public void ShouldCorrectlyCalculateBalanceFromManyExpenses()
        {
            // Arrange
            var user = _context.Users.First(x => x.Nick == "Bryan");
            _userService.ImpersonateUser(user);

            var trip = _context.Trips.SingleOrDefault(x => x.Uid == "berlin");
            var bryanParticipant = trip.Participants.FirstOrDefault(x => x.UsersClaimed.Any(y => y.User.Nick == "Bryan"));
            var dianaParticipant = trip.Participants.FirstOrDefault(x => x.UsersClaimed.Any(y => y.User.Nick == "Diana"));
            var carolParticipant = trip.Participants.FirstOrDefault(x => x.UsersClaimed.Any(y => y.User.Nick == "Carol"));

            _context.Expenses.AddRange(
                new Expense {
                    Name = "Expense A",
                    Type = ExpenseType.Expense,
                    TripUid = trip.Uid,
                    AdderId = user.Id,
                    PayerId = dianaParticipant.Id,
                    Parts = new List<ExpensePart>() {
                        this.CreateExpensePart(12.0M, dianaParticipant.Id, bryanParticipant.Id),
                        this.CreateExpensePart(3.0M, carolParticipant.Id, dianaParticipant.Id, bryanParticipant.Id),
                    },
                },
                new Expense {
                    Name = "Expense B",
                    Type = ExpenseType.Expense,
                    TripUid = trip.Uid,
                    AdderId = user.Id,
                    PayerId = carolParticipant.Id,
                    Parts = new List<ExpensePart>() {
                        this.CreateExpensePart(30.0M, bryanParticipant.Id),
                        this.CreateExpensePart(3.0M, carolParticipant.Id),
                    },
                },
                new Expense {
                    Name = "Expense C",
                    Type = ExpenseType.Expense,
                    TripUid = trip.Uid,
                    AdderId = user.Id,
                    PayerId = carolParticipant.Id,
                    Parts = new List<ExpensePart>() {
                        this.CreateExpensePart(10.0M, dianaParticipant.Id),
                        this.CreateExpensePart(13.0M, bryanParticipant.Id),
                    },
                }
            );
            _context.SaveChanges();

            // Act
            var balance = _balanceService.GetTripBalance(trip.Uid);

            // Assert
            Assert.NotNull(balance);
            Assert.AreEqual(balance.ParticipantsBalance.Count, 3);
            Assert.AreEqual(balance.SettlesBalance.Count, 2);

            var bryanBalance = balance.ParticipantsBalance.FirstOrDefault(x => x.ParticipantId == bryanParticipant.Id);
            Assert.AreEqual(-50.0M, bryanBalance.Value);
            Assert.True(bryanBalance.IsMyBalance);

            var carolBalance = balance.ParticipantsBalance.FirstOrDefault(x => x.ParticipantId == carolParticipant.Id);
            Assert.AreEqual(52.0M, carolBalance.Value);
            Assert.False(carolBalance.IsMyBalance);

            var dianaBalance = balance.ParticipantsBalance.FirstOrDefault(x => x.ParticipantId == dianaParticipant.Id);
            Assert.AreEqual(-2.0M, dianaBalance.Value);
            Assert.False(dianaBalance.IsMyBalance);

            Assert.AreEqual(bryanParticipant.Id, balance.SettlesBalance[0].FromParticipantId);
            Assert.AreEqual(carolParticipant.Id, balance.SettlesBalance[0].ToParticipantId);
            Assert.AreEqual(50.0M, balance.SettlesBalance[0].Value);
            Assert.AreEqual(dianaParticipant.Id, balance.SettlesBalance[1].FromParticipantId);
            Assert.AreEqual(carolParticipant.Id, balance.SettlesBalance[1].ToParticipantId);
            Assert.AreEqual(2.0M, balance.SettlesBalance[1].Value);
        }

        [Test]
        public void ShouldCorrectlyCalculateBalanceWithIncomesAndTransfers()
        {
            // Arrange
            var user = _context.Users.First(x => x.Nick == "Bryan");
            _userService.ImpersonateUser(user);

            var trip = _context.Trips.SingleOrDefault(x => x.Uid == "berlin");
            var bryanParticipant = trip.Participants.FirstOrDefault(x => x.UsersClaimed.Any(y => y.User.Nick == "Bryan"));
            var dianaParticipant = trip.Participants.FirstOrDefault(x => x.UsersClaimed.Any(y => y.User.Nick == "Diana"));
            var carolParticipant = trip.Participants.FirstOrDefault(x => x.UsersClaimed.Any(y => y.User.Nick == "Carol"));

            _context.Expenses.AddRange(
                new Expense {
                    Name = "Transfer",
                    Type = ExpenseType.Transfer,
                    TripUid = trip.Uid,
                    AdderId = user.Id,
                    PayerId = bryanParticipant.Id,
                    Parts = new List<ExpensePart>() {
                        this.CreateExpensePart(6.0M, dianaParticipant.Id),
                    },
                },
                new Expense {
                    Name = "Expense A",
                    Type = ExpenseType.Expense,
                    TripUid = trip.Uid,
                    AdderId = user.Id,
                    PayerId = dianaParticipant.Id,
                    Parts = new List<ExpensePart>() {
                        this.CreateExpensePart(2.0M, dianaParticipant.Id, bryanParticipant.Id),
                        this.CreateExpensePart(3.0M, carolParticipant.Id, dianaParticipant.Id, bryanParticipant.Id),
                    },
                },
                new Expense {
                    Name = "Expense B",
                    Type = ExpenseType.Expense,
                    TripUid = trip.Uid,
                    AdderId = user.Id,
                    PayerId = carolParticipant.Id,
                    Parts = new List<ExpensePart>() {
                        this.CreateExpensePart(2.0M, bryanParticipant.Id),
                        this.CreateExpensePart(2.0M, carolParticipant.Id),
                    },
                },
                new Expense {
                    Name = "Income",
                    Type = ExpenseType.Income,
                    TripUid = trip.Uid,
                    AdderId = user.Id,
                    PayerId = bryanParticipant.Id,
                    Parts = new List<ExpensePart>() {
                        this.CreateExpensePart(3.0M, dianaParticipant.Id, bryanParticipant.Id, carolParticipant.Id),
                    },
                }
            );
            _context.SaveChanges();

            // Act
            var balance = _balanceService.GetTripBalance(trip.Uid);

            // Assert
            Assert.NotNull(balance);
            Assert.AreEqual(balance.ParticipantsBalance.Count, 3);
            Assert.AreEqual(balance.SettlesBalance.Count, 1);

            var bryanBalance = balance.ParticipantsBalance.FirstOrDefault(x => x.ParticipantId == bryanParticipant.Id);
            Assert.AreEqual(0.0M, bryanBalance.Value);

            var carolBalance = balance.ParticipantsBalance.FirstOrDefault(x => x.ParticipantId == carolParticipant.Id);
            Assert.AreEqual(2.0M, carolBalance.Value);

            var dianaBalance = balance.ParticipantsBalance.FirstOrDefault(x => x.ParticipantId == dianaParticipant.Id);
            Assert.AreEqual(-2.0M, dianaBalance.Value);
            Assert.False(dianaBalance.IsMyBalance);

            Assert.AreEqual(dianaParticipant.Id, balance.SettlesBalance[0].FromParticipantId);
            Assert.AreEqual(carolParticipant.Id, balance.SettlesBalance[0].ToParticipantId);
            Assert.AreEqual(2.0M, balance.SettlesBalance[0].Value);
        }

        private ExpensePart CreateExpensePart(decimal value, params int[] participantIds) {

            return new ExpensePart {
                Value = value,
                PartParticipants = participantIds.Select(x => new ExpensePartParticipant {
                    ParticipantId = x,
                }).ToList(),
            };
        }
    }
}