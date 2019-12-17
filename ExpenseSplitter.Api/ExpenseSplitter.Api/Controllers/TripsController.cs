using ExpenseSplitter.Api.Infrastructure;
using ExpenseSplitter.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseSplitter.Api.Controllers
{
    [Authorize]
    [Route(Constants.PublicRouteName + "/trips")]
    public class TripsController : Controller
    {
        private readonly ITripService _tripService;

        public TripsController(ITripService tripService)
        {
            _tripService = tripService;
        }

        [HttpGet]
        public IActionResult GetTrips()
        {
            var trips = _tripService.GetTrips();

            return new JsonResult(trips);
        }

        [HttpGet("{uid}")]
        public IActionResult GetTrip(string uid)
        {
            var trip = _tripService.GetTrip(uid);

            if (trip == null)
                return NotFound();

            return new JsonResult(trip);
        }

        [HttpPost]
        public IActionResult CreateTrip(string name, string description, string organizerName)
        {
            var trip = _tripService.CreateTrip(name, description, organizerName);

            if (trip == null)
                return UnprocessableEntity();
            
            return new JsonResult(trip);
        }

        [HttpDelete("{uid}")]
        public IActionResult DeleteTrip(string uid)
        {
            var result = _tripService.TryDeleteTrip(uid);

            if (!result)
                return NotFound();

            return Ok();
        }
    }
}
