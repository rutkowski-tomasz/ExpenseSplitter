using System.Linq;
using ExpenseSplitter.Api.Infrastructure;
using ExpenseSplitter.Api.Models.Auth;
using ExpenseSplitter.Api.Models.User;
using ExpenseSplitter.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace ExpenseSplitter.Api.Controllers
{
    [Route(Constants.PublicRouteName + "/users")]
    public class UsersController : Controller
    {
        private readonly IUserService _userService;
        private readonly ILogger<UsersController> _logger;

        public UsersController(
            IUserService userService,
            ILogger<UsersController> logger
        ) {
            _userService = userService;
            _logger = logger;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login(string email, string password)
        {
            var authenticatedUser = _userService.AuthenticateUser(email, password);

            if (authenticatedUser == null)
                return Unauthorized();

            var authorizationToken = _userService.GetAuthorizationToken(authenticatedUser);

            return new JsonResult(new { Token = authorizationToken });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register(string email, string password, string nick)
        {
            var registerdUser = _userService.RegisterUser(email, password, nick);

            if (registerdUser == null)
                return Conflict();

            var authorizationToken = _userService.GetAuthorizationToken(registerdUser);

            return new JsonResult(new { Token = authorizationToken });
        }

        [Authorize]
        [HttpGet("{id}")]
        public IActionResult GetUserModel(int id)
        {
            var user = _userService.GetUserModel(id);

            if (user == null)
                return Unauthorized();

            return new JsonResult(user);
        }

        [Authorize]
        [HttpPut]
        public IActionResult UpdateUser([FromBody] UserUpdateModel model)
        {
            if (!ModelState.IsValid) {
                var errors = ModelState.Values.SelectMany(v => v.Errors).ToList();
                _logger.LogWarning("Invalid model for updating user | {model} {errors}",
                    JsonConvert.SerializeObject(model),
                    JsonConvert.SerializeObject(errors)
                );
                return UnprocessableEntity();
            }

            var user = _userService.UpdateUser(model);
            return new JsonResult(user);
        }
    }
}
