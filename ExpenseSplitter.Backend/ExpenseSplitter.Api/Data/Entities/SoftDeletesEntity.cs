using System;

namespace ExpenseSplitter.Api.Data.Entities
{
    public interface SoftDeletesEntity
    {
        DateTime? DeletedAt { get; set; }
    }
}