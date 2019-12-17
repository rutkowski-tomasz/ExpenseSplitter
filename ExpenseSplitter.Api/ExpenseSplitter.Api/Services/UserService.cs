

using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;

namespace ExpenseSplitter.Api.Services
{
    public interface IUserService
    {
        User AuthenticateUser(string email, string password);
        bool RegisterUser(string email, string password);
        string GetAuthorizationToken(User user);
        int GetCurrentUserId();
        User GetCurrentUser();
    }

    public class UserService : IUserService
    {
        private readonly IConfigProvider _configProvider;
        private readonly Context _context;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserService(
            IConfigProvider configProvider,
            Context context,
            IPasswordHasher passwordHasher,
            IHttpContextAccessor httpContextAccessor
        ) {
            _configProvider = configProvider;
            _context = context;
            _passwordHasher = passwordHasher;
            _httpContextAccessor = httpContextAccessor;
        }

        public User AuthenticateUser(string email, string password)
        {
            var hashedPassword = _passwordHasher.Hash(password);
            var user = _context
                .Users
                .FirstOrDefault(x => x.Email == email.ToLowerInvariant());

            return (user != null && _passwordHasher.Check(user.Password, password)) ? user : null;
        }

        public bool RegisterUser(string email, string password)
        {
            var user = new User()
            {
                Email = email.ToLowerInvariant(),
                Password = _passwordHasher.Hash(password),
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return true;
        }

        public string GetAuthorizationToken(User user)
        {
            var key = _configProvider.AuthorizationSecretKey;
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256Signature);

            var tokenOptions = new JwtSecurityToken(
                issuer: _configProvider.SecurityTokenIssuer,
                audience: _configProvider.SecurityTokenAudience,
                claims: new List<Claim>()
                {
                    new Claim("UserId", user.Id.ToString()),
                },
                expires: DateTime.Now.AddSeconds(_configProvider.SecurityTokenExpirationTimeInSeconds),
                signingCredentials: signinCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }

        public User GetUser(int userId)
        {
            return _context.Users.SingleOrDefault(x => x.Id == userId);
        }

        public int GetCurrentUserId()
        {
            return int.Parse(_httpContextAccessor.HttpContext.User.FindFirst("UserId").Value);
        }

        public User GetCurrentUser()
        {
            return GetUser(GetCurrentUserId());
        }
    }
    
}