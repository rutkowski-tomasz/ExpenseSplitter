using Microsoft.EntityFrameworkCore;

namespace ExpenseSplitter.Api.Data
{
    public class ExpenseSplitterContext : DbContext
    {
        public virtual DbSet<User> Users { get; set; }

        public ExpenseSplitterContext(DbContextOptions<ExpenseSplitterContext> options) : base(options)
        {
        }
    }
}