using ExpenseSplitter.Api.Infrastructure;
using ExpenseSplitter.Api.Models.Trips;
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
        public IActionResult CreateTrip([FromBody] CreateTripModel model)
        {
            if (!ModelState.IsValid)
                return UnprocessableEntity();

            var trip = _tripService.CreateTrip(model);

            return new JsonResult(trip);
        }

        [HttpPut]
        public IActionResult UpdateTrip(UpdateTripModel model)
        {
            if (!ModelState.IsValid)
                return UnprocessableEntity();

            var trip = _tripService.UpdateTrip(model);

            if (trip == null)
                return NotFound();
            
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

        [HttpPost("{uid}/join")]
        public IActionResult JoinTrip(string uid)
        {
            var trip = _tripService.JoinTrip(uid);

            if (trip == null)
                return NotFound();

            return Ok();
        }
        
        [HttpPost("{uid}/leave")]
        public IActionResult LeaveTrip(string uid)
        {
            var result = _tripService.LeaveTrip(uid);

            if (!result)
                return NotFound();

            return Ok();
        }

        [HttpPost("{uid}/participation/{id}")]
        public IActionResult ClaimTripParticipation(string uid, int id)
        {
            var result = _tripService.ClaimTripParticipation(uid, id);

            if (!result)
                return NotFound();

            return Ok();
        }
    }
}
