namespace ExpenseSplitter.Api.Infrastructure
{
    public interface IConfigProvider
    {
        int PasswordHashIterations { get; set; }
        string SecurityTokenIssuer { get; set; }
        string SecurityTokenAudience { get; set; }
        int SecurityTokenExpirationTimeInSeconds { get; set; }
        string AuthorizationSecretKey { get; set; }
    }

    public class ConfigProvider : IConfigProvider
    {
        public int PasswordHashIterations { get; set; }
        public string SecurityTokenIssuer { get; set; }
        public string SecurityTokenAudience { get; set; }
        public int SecurityTokenExpirationTimeInSeconds { get; set; }
        public string AuthorizationSecretKey { get; set; }
    }
}