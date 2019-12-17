using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExpenseSplitter.Api.Data
{
    public class Trip
    {
        [Key]
        [StringLength(16)]
        public string Uid { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        [StringLength(100)]
        public string Description { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
