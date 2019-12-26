using ExpenseSplitter.Api.Infrastructure;
using ExpenseSplitter.Api.Models.Auth;
using ExpenseSplitter.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseSplitter.Api.Controllers
{
    [Route(Constants.PublicRouteName + "/users")]
    public class UsersController : Controller
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            var authenticatedUser = _userService.AuthenticateUser(model);

            if (authenticatedUser == null)
                return Unauthorized();

            var authorizationToken = _userService.GetAuthorizationToken(authenticatedUser);

            return new JsonResult(new { Token = authorizationToken });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register(RegisterModel model)
        {
            var registerdUser = _userService.RegisterUser(model);

            if (registerdUser == null)
                return BadRequest();

            var authorizationToken = _userService.GetAuthorizationToken(registerdUser);

            return new JsonResult(new { Token = authorizationToken });
        }

        [Authorize]
        [HttpGet("{id}")]
        public IActionResult GetUserExtract(int id)
        {
            var userExtract = _userService.GetUserExtract(id);
            
            if (userExtract == null)
                return Unauthorized();

            return new JsonResult(userExtract);
        }
    }
}