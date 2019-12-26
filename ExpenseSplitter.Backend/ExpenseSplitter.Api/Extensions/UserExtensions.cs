using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Models.Auth;

namespace ExpenseSplitter.Api.Extensions
{
    public static class UserExtensions
    {
        public static UserExtractModel ToUserExtract(this User user)
        {
            return new UserExtractModel
            {
                Id = user.Id,
                Email = user.Email,
                Nickname = user.Nickname,
                IsEmailConfirmed = user.IsEmailConfirmed,
            };
        }
    }
}
