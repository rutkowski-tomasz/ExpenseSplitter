using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ExpenseSplitter.Api.Infrastructure;

namespace ExpenseSplitter.Api.Data
{
    public class User
    {
        [Key] public int Id { get; set; }

        [StringLength(Constants.UserEmailLength)]
        public string Email { get; set; }

        [StringLength(Constants.UserPasswordLength)]
        public string Password { get; set; }

        [StringLength(Constants.UserNameLength)]
        public string Name { get; set; }

        [StringLength(Constants.UserNicknameLength)]
        public string Nickname { get; set; }
        public bool IsEmailConfirmed { get; set; }


        public virtual ICollection<Participant> Participations { get; set; }
        public virtual ICollection<TripUser> UserTrips { get; set; }
    }
}
