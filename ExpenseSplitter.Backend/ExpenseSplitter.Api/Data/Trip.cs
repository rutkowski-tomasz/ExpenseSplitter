using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ExpenseSplitter.Api.Data.Entities;
using ExpenseSplitter.Api.Infrastructure;

namespace ExpenseSplitter.Api.Data
{
    public class Trip : CreatedAtEntity, SoftDeletesEntity
    {
        [Key]
        [StringLength(Constants.UidLength)]
        public string Uid { get; set; }

        [StringLength(Constants.TripNameLength)]
        public string Name { get; set; }

        [StringLength(Constants.TripDescriptionLength)]
        public string Description { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }

        public virtual ICollection<Participant> Participants { get; set; }
        public virtual ICollection<TripUser> Users { get; set; }
        public virtual ICollection<Expense> Expenses { get; set; }
    }
}
