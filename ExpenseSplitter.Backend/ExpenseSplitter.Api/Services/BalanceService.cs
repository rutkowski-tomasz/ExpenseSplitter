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
        BalanceResponseModel GetTripBalance(string uid);
    }

    public class BalanceService : IBalanceService
    {
        private readonly Context _context;
        private readonly ILogger _logger;
        private readonly IUserService _userService;

        public BalanceService(
            Context context,
            ILogger<BalanceService> logger,
            IUserService userService
        ) {
            _context = context;
            _logger = logger;
            _userService = userService;
        }

        public BalanceResponseModel GetTripBalance(string uid)
        {
            var userId = _userService.GetCurrentUserId();
            _logger.LogDebug($"User {userId} requested trip {uid} balance");

            var trip = _context
                .Trips
                .Include(x => x.Participants)
                .SingleOrDefault(x =>
                    x.Uid == uid &&
                    x.Users.Any(y => y.UserId == userId)
                );

            if (trip == null)
                return null;

            var response = new BalanceResponseModel();
            response.ParticipantsBalance = calculateParticipantsBalance(trip.Participants, uid);

            var balanceDiffs = buildBalanceDiffList(response.ParticipantsBalance);
            response.SettlesBalance = calculateSettlesBalance(balanceDiffs);

            return response;
        }

        private List<ParticipantBalance> calculateParticipantsBalance(ICollection<Participant> participants, string tripUid)
        {
            var participantsBalance = new List<ParticipantBalance>();

            foreach (var participant in participants)
            {
                var balance = _context
                    .ExpensesParts
                    .Include(x => x.Participants)
                    .Include(x => x.Expense)
                    .Where(x => x.Expense.TripUid == tripUid)
                    .ToList();

                var c = balance.Select(x => new {
                    IPaid = (x.Expense.PayerId == participant.Id ? 1.0M : 0.0M) * x.Value,
                    ISpent = (x.Participants.Any(y => y.Id == participant.Id) ? 1.0M : 0.0M) * (x.Value / x.Participants.Count),
                });

                var b = balance.Select(x =>
                        (
                            (x.Expense.PayerId == participant.Id ? 1.0M : 0.0M) * x.Value
                        )
                        - (
                            (x.Participants.Any(y => y.Id == participant.Id) ? 1.0M : 0.0M) * (x.Value / x.Participants.Count)
                        )
                    );

                var a = b.Sum();

                participantsBalance.Add(new ParticipantBalance {
                    ParticipantId = participant.Id,
                    ParticipantNick = participant.Name,
                    Value = a
                });
            }

            participantsBalance = participantsBalance.OrderByDescending(x => x.Value).ToList();
            return participantsBalance;
        }

        private List<BalanceDiff> buildBalanceDiffList(List<ParticipantBalance> participantsBalance)
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

        private List<SettleBalance> calculateSettlesBalance(List<BalanceDiff> balanceDiffs)
        {
            var settlesBalance = new List<SettleBalance>();

            for (var i = 0; i < balanceDiffs.Count; i++)
            {
                var balanceDiff = balanceDiffs[i];
                if (balanceDiff.Diff <= 0)
                    break;

                for(var j = i + 1; balanceDiff.Diff > 0 && j < balanceDiffs.Count; j++)
                {
                    var otherBalanceDiff = balanceDiffs[j];
                    if (balanceDiff.Diff > 0)
                        continue;

                    var settleBalance = new SettleBalance
                    {
                        Value = Math.Min(balanceDiff.Diff, -otherBalanceDiff.Diff),
                        FromParticipantId = otherBalanceDiff.ParticipantId,
                        FromParticipantNick = otherBalanceDiff.ParticipantNick,
                        ToParticipantId = balanceDiff.ParticipantId,
                        ToParticipantNick = balanceDiff.ParticipantNick,
                    };

                    balanceDiff.Diff -= settleBalance.Value;
                    otherBalanceDiff.Diff += settleBalance.Value;
                    settlesBalance.Add(settleBalance);
                }
            }

            return settlesBalance;
        }
    }
}