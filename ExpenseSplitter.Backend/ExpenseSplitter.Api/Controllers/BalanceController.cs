using System.Globalization;
using ExpenseSplitter.Api.Infrastructure;
using ExpenseSplitter.Api.Models.Trips;
using ExpenseSplitter.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseSplitter.Api.Controllers
{
    [Authorize]
    [Route(Constants.PublicRouteName + "/trips/{uid}/balance")]
    public class BalanceController : Controller
    {
        private readonly IBalanceService _balanceService;

        public BalanceController(IBalanceService balanceService)
        {
            _balanceService = balanceService;
        }

        [HttpGet]
        public IActionResult GetTripBalance(string uid)
        {
            var balance = _balanceService.GetTripBalance(uid);

            if (balance == null)
                return NotFound();

            return new JsonResult(balance);
        }

        [HttpPost("markSettlementAsPaid")]
        public IActionResult MarkSettlementAsPaid(string uid, string value, int fromParticipantId, int toParticipantId)
        {
            var decimalValue = decimal.Parse(value, CultureInfo.InvariantCulture);
            var expense = _balanceService.MarkSettlementAsPaid(uid, decimalValue, fromParticipantId, toParticipantId);

            if (expense == null)
                return NotFound();

            return Ok();
        }
    }
}