using System.ComponentModel.DataAnnotations;

namespace ExpenseSplitter.Api.Data
{
    public class User
    {
        [Key] public int UserId { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }
    }
}
