using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Models.Auth;

namespace ExpenseSplitter.Api.Extensions
{
    public interface IUserExtensions
    {
        UserModel ToUserModel(User user);
    }

    public class UserExtensions : IUserExtensions
    {
        public UserModel ToUserModel(User user)
        {
            if (user == null)
                return null;

            return new UserModel
            {
                Id = user.Id,
                Email = user.Email,
                Nick = user.Nick,
                IsEmailConfirmed = user.IsEmailConfirmed,
            };
        }
    }
}
