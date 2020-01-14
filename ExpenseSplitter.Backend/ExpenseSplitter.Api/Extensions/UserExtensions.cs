using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Models.Auth;

namespace ExpenseSplitter.Api.Extensions
{
    public interface IUserExtensions
    {
        UserExtractModel ToUserExtract(User user);
    }

    public class UserExtensions : IUserExtensions
    {
        public UserExtractModel ToUserExtract(User user)
        {
            if (user == null)
                return null;

            return new UserExtractModel
            {
                Id = user.Id,
                Email = user.Email,
                Nick = user.Nick,
                IsEmailConfirmed = user.IsEmailConfirmed,
            };
        }
    }
}
