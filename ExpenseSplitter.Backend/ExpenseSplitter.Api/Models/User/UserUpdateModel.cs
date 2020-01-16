using System.ComponentModel.DataAnnotations;
using ExpenseSplitter.Api.Infrastructure;

namespace ExpenseSplitter.Api.Models.User
{
    public class UserUpdateModel
    {
        [Required, MinLength(Constants.ParticipantNameMinLength), MaxLength(Constants.ParticipantNameMaxLength)]
        public string Nick { get; set; }
    }
}
