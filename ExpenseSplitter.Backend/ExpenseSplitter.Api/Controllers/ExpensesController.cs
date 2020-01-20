using System.Linq;
using ExpenseSplitter.Api.Infrastructure;
using ExpenseSplitter.Api.Models.Expenses;
using ExpenseSplitter.Api.Models.Trips;
using ExpenseSplitter.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace ExpenseSplitter.Api.Controllers
{
    [Authorize]
    [Route(Constants.PublicRouteName + "/trips/{uid}/expenses")]
    public class ExpensesController : Controller
    {
        private readonly IExpenseService _expenseService;
        private readonly ILogger<ExpensesController> _logger;

        public ExpensesController(
            IExpenseService expenseService,
            ILogger<ExpensesController> logger
        ) {
            _expenseService = expenseService;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult GetExpenses(string uid)
        {
            var expenses = _expenseService.GetExpenses(uid);

            return new JsonResult(expenses);
        }
        
        [HttpGet("{id}")]
        public IActionResult GetExpense(string uid, int id)
        {
            var expense = _expenseService.GetExpense(uid, id);

            return new JsonResult(expense);
        }

        [HttpPost]
        public IActionResult CreateExpense(string uid, [FromBody] ExpenseUpdateModel model)
        {
            if (!ModelState.IsValid) {
                var errors = ModelState.Values.SelectMany(v => v.Errors).ToList();
                _logger.LogWarning("Invalid model for creating expense | {model} {errors}",
                    JsonConvert.SerializeObject(model),
                    JsonConvert.SerializeObject(errors)
                );
                return UnprocessableEntity();
            }

            var result = _expenseService.CreateExpense(uid, model);

            if (result == 0)
                return NotFound();

            return new JsonResult(result);
        }

        [HttpPut]
        public IActionResult UpdateExpense(string uid, [FromBody] ExpenseUpdateModel model)
        {
            if (!ModelState.IsValid) {
                var errors = ModelState.Values.SelectMany(v => v.Errors).ToList();
                _logger.LogWarning("Invalid model for updating expense | {model} {errors}",
                    JsonConvert.SerializeObject(model),
                    JsonConvert.SerializeObject(errors)
                );
                return UnprocessableEntity();
            }

            var result = _expenseService.TryUpdateExpense(uid, model);

            if (!result)
                return NotFound();

            return new JsonResult(result);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteExpense(string uid, int id)
        {
            var result = _expenseService.TryDeleteExpense(uid, id);

            if (!result)
                return NotFound();

            return Ok();
        }
    }
}
