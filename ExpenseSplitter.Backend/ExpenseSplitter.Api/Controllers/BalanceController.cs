using System.Globalization;
using ExpenseSplitter.Api.Infrastructure;
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

        [HttpGet("short")]
        public IActionResult GetTripShortBalance(string uid)
        {
            var balance = _balanceService.GetTripShortBalance(uid);

            if (balance == null)
                return NotFound();

            return new JsonResult(balance);
        }
    }
}