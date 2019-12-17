using Microsoft.EntityFrameworkCore;

namespace ExpenseSplitter.Api.Data
{
    public class Context : DbContext
    {
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Trip> Trips { get; set; }
        public virtual DbSet<TripUser> TripsUsers { get; set; }
        public virtual DbSet<Expense> Expenses { get; set; }
        public virtual DbSet<ExpensePart> ExpensesParts { get; set; }
        public virtual DbSet<ExpensePartUser> ExpensesPartsUsers { get; set; }

        public Context(DbContextOptions<Context> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }
    }
}