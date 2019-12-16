using ExpenseSplitter.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseSplitter.Api.Controllers
{
    public class HomeController : Controller
    {
        private readonly ITestService _testService;
        public HomeController(ITestService testService)
        {
            _testService = testService;
        }

        public string Index()
        {
            return "This is my default action..." + _testService.GetSomeNumber();
        }
    }
}
