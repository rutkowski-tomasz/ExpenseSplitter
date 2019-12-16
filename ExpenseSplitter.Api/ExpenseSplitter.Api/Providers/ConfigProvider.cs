namespace Frugal.Api.Providers
{
    public interface IConfigProvider
    {
        int SomeTestValue { get; set; }
    }

    public class ConfigProvider : IConfigProvider
    {
        public int SomeTestValue { get; set; }
    }
}