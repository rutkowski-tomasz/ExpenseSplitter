

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
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;

namespace ExpenseSplitter.Api.Services
{
    public interface IUserService
    {
        User AuthenticateUser(LoginModel model);
        User RegisterUser(RegisterModel model);
        string GetAuthorizationToken(User user);
        int GetCurrentUserId();
        User GetCurrentUser();
        UserExtractModel GetUserExtract(int id);
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

        public User AuthenticateUser(LoginModel model)
        {
            var hashedPassword = _passwordHasher.Hash(model.Password);
            var user = _context
                .Users
                .FirstOrDefault(x => x.Email == model.Email.ToLowerInvariant());

            return (user != null && _passwordHasher.Check(user.Password, model.Password)) ? user : null;
        }

        public User RegisterUser(RegisterModel model)
        {
            var user = new User()
            {
                Email = model.Email.ToLowerInvariant(),
                Password = _passwordHasher.Hash(model.Password),
            };

            _context.Users.Add(user);
            _context.SaveChanges();

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
        
        public UserExtractModel GetUserExtract(int id)
        {
            if (id != GetCurrentUserId())
                return null;

            return GetUser(id)?.ToUserExtract();
        }
    }
    
}