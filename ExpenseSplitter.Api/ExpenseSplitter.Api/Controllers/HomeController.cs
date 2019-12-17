using ExpenseSplitter.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseSplitter.Api.Controllers
{
    public class HomeController : Controller
    {
        public HomeController()
        {
        }

        public string Index()
        {
            return "Hello";
        }
    }
}
