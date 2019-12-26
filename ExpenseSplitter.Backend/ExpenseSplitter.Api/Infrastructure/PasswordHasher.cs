using System;
using System.Linq;
using System.Security.Cryptography;

namespace ExpenseSplitter.Api.Infrastructure
{
    public interface IPasswordHasher
    {
        string Hash(string password);
        
        bool Check(string hash, string password);
    }

    public sealed class PasswordHasher : IPasswordHasher 
    {
        private const int _saltSize = 16;
        private const int _keySize = 32;
        private readonly int _iterations;

        public PasswordHasher(IConfigProvider configProvider)
        {
            _iterations = configProvider.PasswordHashIterations;
        }

        public string Hash(string password)
        {
            using (var algorithm = new Rfc2898DeriveBytes(
                password,
                _saltSize,
                _iterations,
                HashAlgorithmName.SHA512))
            {
                var key = Convert.ToBase64String(algorithm.GetBytes(_keySize));
                var salt = Convert.ToBase64String(algorithm.Salt);

                return $"{_iterations}.{salt}.{key}";
            }
        }

        public bool Check(string hash, string password)
        {
            var parts = hash.Split('.', 3);

            if (parts.Length != 3)
            {
                throw new FormatException("Unexpected hash format. " +
                    "Should be formatted as `{iterations}.{salt}.{hash}`");
            }

            var iterations = Convert.ToInt32(parts[0]);
            var salt = Convert.FromBase64String(parts[1]);
            var key = Convert.FromBase64String(parts[2]);

            using (var algorithm = new Rfc2898DeriveBytes(
                password,
                salt,
                iterations,
                HashAlgorithmName.SHA512))
            {
                var keyToCheck = algorithm.GetBytes(_keySize);

                var verified = keyToCheck.SequenceEqual(key);

                return verified;
            }
        }
    }
}