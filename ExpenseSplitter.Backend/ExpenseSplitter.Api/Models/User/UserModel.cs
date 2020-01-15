
namespace ExpenseSplitter.Api.Models.Auth
{
    public class UserModel
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Nick { get; set; }
        public bool IsEmailConfirmed { get; set; }
    }
}
