using System.Linq;
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

        [HttpGet("{uid}/participants")]
        public IActionResult GetTripParticipants(string uid)
        {
            var participants = _tripService.GetTripParticipants(uid);

            if (participants == null)
                return NotFound();

            return new JsonResult(participants);
        }

        [HttpPost]
        public IActionResult CreateTrip([FromBody] TripCreateModel model)
        {
            if (!ModelState.IsValid)
                return UnprocessableEntity();

            var trip = _tripService.CreateTrip(model);

            return new JsonResult(trip);
        }

        [HttpPut]
        public IActionResult UpdateTrip([FromBody] TripUpdateModel model)
        {
            if (!ModelState.IsValid)
                return UnprocessableEntity();

            if (model.Participants.GroupBy(x => x.Nick).Any(g => g.Count() > 1))
                return UnprocessableEntity();

            var result = _tripService.TryUpdateTrip(model);

            if (!result)
                return NotFound();
            
            return new JsonResult(result);
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
            var result = _tripService.TryJoinTrip(uid);

            if (!result)
                return NotFound();

            return Ok();
        }
        
        [HttpPost("{uid}/leave")]
        public IActionResult LeaveTrip(string uid)
        {
            var result = _tripService.TryLeaveTrip(uid);

            if (!result)
                return NotFound();

            return Ok();
        }

        [HttpPost("{uid}/participation/{id}")]
        public IActionResult ClaimTripParticipation(string uid, int id)
        {
            var result = _tripService.TryClaimTripParticipation(uid, id);

            if (!result)
                return NotFound();

            return Ok();
        }
    }
}
