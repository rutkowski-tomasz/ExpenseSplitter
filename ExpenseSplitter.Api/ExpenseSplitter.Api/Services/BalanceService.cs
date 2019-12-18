using System;
using System.Collections.Generic;
using System.Linq;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Models.Balance;

namespace ExpenseSplitter.Api.Services
{
    public interface IBalanceService
    {
        BalanceResponseModel GetTripBalance(string uid);
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

        public BalanceResponseModel GetTripBalance(string uid)
        {
            var userId = _userService.GetCurrentUserId();
            var trip = _context.Trips.SingleOrDefault(x => x.Uid == uid && x.Users.Any(y => y.UserId == userId));

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
                    .Where(x => x.Expense.TripUid == tripUid)
                    .Select(x =>
                        (((x.Expense.PayerId == participant.Id) ? 1.0M : 0.0M) 
                        * x.Value)
                        - (((x.Participants.Any(y => y.Id == participant.Id)) ? 1.0M : 0.0M)
                        * (x.Value / x.Participants.Count))
                    ).Sum();

                participantsBalance.Add(new ParticipantBalance {
                    Participant = participant,
                    Value = balance
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
                    Participant = participantBalance.Participant,
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

                var j = i + 1;
                while (balanceDiff.Diff > 0 && j < balanceDiffs.Count)
                {
                    var otherBalanceDiff = balanceDiffs[j];
                    if (balanceDiff.Diff > 0)
                        continue;

                    var settleBalance = new SettleBalance
                    {
                        Value = Math.Min(balanceDiff.Diff, -otherBalanceDiff.Diff),
                        FromParticipant = otherBalanceDiff.Participant,
                        ToParticipant = balanceDiff.Participant,
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