

using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Extensions;
using ExpenseSplitter.Api.Infrastructure;
using ExpenseSplitter.Api.Models.Auth;
using ExpenseSplitter.Api.Models.User;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace ExpenseSplitter.Api.Services
{
    public interface IUserService
    {
        User AuthenticateUser(string email, string password);
        User RegisterUser(string email, string password, string nick);
        string GetAuthorizationToken(User user);
        int GetCurrentUserId();
        User GetCurrentUser();
        UserModel GetUserModel(int id);
        UserModel UpdateUser(UserUpdateModel model);
    }

    public class UserService : IUserService
    {
        private readonly IConfigProvider _configProvider;
        private readonly Context _context;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUserExtensions _userExtensions;
        private readonly ILogger _logger;

        public UserService(
            IConfigProvider configProvider,
            Context context,
            IPasswordHasher passwordHasher,
            IHttpContextAccessor httpContextAccessor,
            IUserExtensions userExtensions,
            ILogger<UserService> logger
        ) {
            _configProvider = configProvider;
            _context = context;
            _passwordHasher = passwordHasher;
            _httpContextAccessor = httpContextAccessor;
            _userExtensions = userExtensions;
            _logger = logger;
        }

        public User AuthenticateUser(string email, string password)
        {
            var hashedPassword = _passwordHasher.Hash(password);
            var user = _context
                .Users
                .FirstOrDefault(x =>
                    x.Email == email.ToLowerInvariant()
                    && _passwordHasher.Check(x.Password, password)
                );

            if (user == null)
                return null;

            _logger.LogInformation("Authenticated user #{Id} with email: {Email}", user.Id, email);
            return user;
        }

        public User RegisterUser(string email, string password, string nick)
        {
            email = email.ToLowerInvariant();

            var isEmailExisting = _context.Users.FirstOrDefault(x => x.Email == email) != null;
            if (isEmailExisting)
                return null;

            var user = new User()
            {
                Email = email,
                Password = _passwordHasher.Hash(password),
                Nick = nick
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            _logger.LogInformation("Registered new user #{Id} with email: {Email}", user.Id, email);

            return user;
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
                    new Claim(Constants.UserIdClaimKey, user.Id.ToString()),
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
            return int.Parse(_httpContextAccessor.HttpContext.User.FindFirst(Constants.UserIdClaimKey).Value);
        }

        public User GetCurrentUser()
        {
            return GetUser(GetCurrentUserId());
        }
        
        public UserModel GetUserModel(int id)
        {
            if (id != GetCurrentUserId())
                return null;

            return _userExtensions.ToUserModel(GetUser(id));
        }
        
        public UserModel UpdateUser(UserUpdateModel model)
        {
            var user = GetCurrentUser();

            user.Nick = model.Nick;

            _context.SaveChanges();

            _logger.LogInformation("Updated user #{Id} with email: {Email}", user.Id, user.Email);
            return _userExtensions.ToUserModel(user);
        }
    }
    
}