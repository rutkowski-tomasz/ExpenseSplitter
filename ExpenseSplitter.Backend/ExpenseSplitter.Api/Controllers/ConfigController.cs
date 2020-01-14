using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using ExpenseSplitter.Api.Infrastructure;
using ExpenseSplitter.Api.Models.Trips;
using ExpenseSplitter.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseSplitter.Api.Controllers
{
    [Authorize]
    [Route(Constants.PublicRouteName + "/config")]
    public class ConfigController : Controller
    {
        public ConfigController() { }

        [HttpGet("constants")]
        public IActionResult GetContstants()
        {
            var constants = new Dictionary<string, object>();

            typeof(Constants)
                .GetFields()
                .Where(x => x.IsLiteral && !x.IsInitOnly)
                .ToList()
                .ForEach(x => constants.Add(x.Name, x.GetValue(null)));

            return new JsonResult(constants);
        }
    }
}