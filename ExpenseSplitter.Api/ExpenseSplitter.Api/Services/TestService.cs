

using System.Linq;
using ExpenseSplitter.Api.Data;
using Frugal.Api.Providers;

namespace ExpenseSplitter.Api.Services
{
    public interface ITestService
    {
        int GetSomeNumber();
    }

    public class TestService : ITestService
    {
        private readonly IConfigProvider _configProvider;
        private readonly ExpenseSplitterContext _context;

        public TestService(IConfigProvider configProvider, ExpenseSplitterContext expenseSplitterContext)
        {
            _configProvider = configProvider;
            _context = expenseSplitterContext;
        }

        public int GetSomeNumber()
        {
            var a = _context.Users.ToList();
            return _configProvider.SomeTestValue;
        }
    }
}