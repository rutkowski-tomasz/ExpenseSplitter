using System;
using System.Collections.Generic;
using System.Linq;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Models.Balance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ExpenseSplitter.Api.Services
{
    public interface IBalanceService
    {
        BalanceModel GetTripBalance(string uid);
        BalanceSimpleModel GetTripShortBalance(string uid);
    }

    public class BalanceService : IBalanceService
    {
        private readonly Context _context;
        private readonly IUserService _userService;

        public BalanceService(
            Context context,
            IUserService userService
        ) {
            _context = context;
            _userService = userService;
        }

        public BalanceModel GetTripBalance(string uid)
        {
            var userId = _userService.GetCurrentUserId();

            var trip = _context
                .Trips
                .Include(x => x.Participants)
                .ThenInclude(x => x.UsersClaimed)
                .SingleOrDefault(x =>
                    x.Uid == uid &&
                    x.Users.Any(y => y.UserId == userId)
                );

            if (trip == null)
                return null;

            var myParticipantId = trip.Participants
                .Where(x => x.UsersClaimed.Any(y => y.UserId == userId))
                .Select(x => x.Id)
                .FirstOrDefault();

            var response = new BalanceModel();
            response.ParticipantsBalance = calculateParticipantsBalance(trip.Participants, uid, myParticipantId);

            var balanceDiffs = buildBalanceDiffList(response.ParticipantsBalance);
            response.SettlesBalance = calculateSettlesBalance(balanceDiffs, myParticipantId);

            return response;
        }

        public BalanceSimpleModel GetTripShortBalance(string uid)
        {
            var userId = _userService.GetCurrentUserId();
            var trip = _context
                .Trips
                .Include(x => x.Expenses)
                .ThenInclude(x => x.Parts)
                .SingleOrDefault(x => 
                    x.Uid == uid &&
                    x.Users.Any(y => y.UserId == userId)
                );

            if (trip == null)
                return null;

            var totalCost = trip
                .Expenses
                .Where(x => x.Type != ExpenseType.Transfer)
                .Sum(x => x
                    .Parts
                    .Select(
                        y => (x.Type == ExpenseType.Expense ? 1.0M : -1.0M) * y.Value
                    )
                    .Sum()
                );

            var myCost = _context
                .ExpensesParts
                .Include(x => x.PartParticipants)
                .Include(x => x.Expense)
                .Where(x => x.Expense.TripUid == trip.Uid)
                .Where(x => x.PartParticipants.Any(y => y.Participant.UsersClaimed.Any(z => z.UserId == userId)))
                .Where(x => x.Expense.Type != ExpenseType.Transfer)
                .Select(x => (x.Expense.Type == ExpenseType.Expense ? 1.0M : -1.0M) * (x.Value /  x.PartParticipants.Count))
                .Sum();

            return new BalanceSimpleModel
            {
                MyCost = myCost,
                TotalCost = totalCost,
            };
        }

        private List<BalanceParticipantModel> calculateParticipantsBalance(ICollection<Participant> participants, string tripUid, int myParticipantId)
        {
            var userId = _userService.GetCurrentUserId();
            var participantsBalance = new List<BalanceParticipantModel>();

            foreach (var participant in participants)
            {
                var balance = _context
                    .ExpensesParts
                    .Include(x => x.PartParticipants)
                    .Include(x => x.Expense)
                    .Where(x => x.Expense.TripUid == tripUid)
                    .Select(x => new {
                        IsPaidByMe = x.Expense.PayerId == participant.Id,
                        Value = x.Value,
                        IsPaidForMe = x.PartParticipants.Any(y => y.ParticipantId == participant.Id),
                        SplitCount = x.PartParticipants.Count,
                        Type = x.Expense.Type,
                    })
                    .Select(x => 

                        (x.Type == ExpenseType.Expense) ?
                            ((x.IsPaidByMe ? 1.0M : 0.0M) * x.Value) - ((x.IsPaidForMe ? 1.0M : 0.0M) * x.Value / x.SplitCount)
                        : (x.Type == ExpenseType.Income) ?
                            ((x.IsPaidByMe ? -1.0M : 0.0M) * x.Value) - ((x.IsPaidForMe ? -1.0M : 0.0M) * x.Value / x.SplitCount)
                        : (x.Type == ExpenseType.Transfer) ?
                            ((x.IsPaidByMe ? 1.0M : 0.0M) * x.Value) - ((x.IsPaidForMe ? 1.0M : 0.0M) * x.Value / x.SplitCount)
                        : 0.0M
                    )
                    .Sum();

                participantsBalance.Add(new BalanceParticipantModel {
                    ParticipantId = participant.Id,
                    ParticipantNick = participant.Name,
                    Value = balance,
                    IsMyBalance = participant.Id == myParticipantId
                });
            }

            participantsBalance = participantsBalance.ToList();
            return participantsBalance;
        }

        private List<BalanceDiff> buildBalanceDiffList(List<BalanceParticipantModel> participantsBalance)
        {
            var balanceDiffs = new List<BalanceDiff>();

            foreach (var participantBalance in participantsBalance)
            {
                balanceDiffs.Add(new BalanceDiff
                {
                    Diff = participantBalance.Value,
                    ParticipantNick = participantBalance.ParticipantNick,
                    ParticipantId = participantBalance.ParticipantId,
                });
            }

            return balanceDiffs;
        }

        private List<BalanceSettleModel> calculateSettlesBalance(List<BalanceDiff> balanceDiffs, int myParticipantId)
        {
            var settlesBalance = new List<BalanceSettleModel>();

            for (var i = 0; i < balanceDiffs.Count; i++)
            {
                var balanceDiff = balanceDiffs[i];

                while (balanceDiff.Diff > 0) {
                    var j = GetReturnerIndex(balanceDiffs);

                    if (j == -1)
                        break;

                    var otherBalanceDiff = balanceDiffs[j];

                    var settleBalance = new BalanceSettleModel
                    {
                        Value = Math.Min(balanceDiff.Diff, -otherBalanceDiff.Diff),
                        FromParticipantId = otherBalanceDiff.ParticipantId,
                        FromParticipantNick = otherBalanceDiff.ParticipantNick,
                        AmIFromParticipant = otherBalanceDiff.ParticipantId == myParticipantId,
                        ToParticipantId = balanceDiff.ParticipantId,
                        ToParticipantNick = balanceDiff.ParticipantNick,
                        AmIToParticipant = balanceDiff.ParticipantId == myParticipantId,
                    };

                    balanceDiff.Diff -= settleBalance.Value;
                    otherBalanceDiff.Diff += settleBalance.Value;
                    settlesBalance.Add(settleBalance);
                }
            }

            return settlesBalance;
        }

        private int GetReturnerIndex(List<BalanceDiff> balanceDiffs)
        {
            var min = balanceDiffs
                .Select((value, index) => new {
                    Diff = value.Diff,
                    ParticipantId = value.ParticipantId,
                    Index = index
                })
                .Where(x => x.Diff < 0)
                .OrderBy(x => x.ParticipantId)
                .FirstOrDefault();

            if (min == null)
                return -1;

            return min.Index;
        }
    }
}