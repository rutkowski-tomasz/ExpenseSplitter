
namespace ExpenseSplitter.Api.Models.Auth
{
    public class UserExtractModel
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Nickname { get; set; }
        public bool IsEmailConfirmed { get; set; }
    }
}
