

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

        public TestService(IConfigProvider configProvider)
        {
            _configProvider = configProvider;
        }

        public int GetSomeNumber()
        {
            return _configProvider.SomeTestValue;
        }
    }
}