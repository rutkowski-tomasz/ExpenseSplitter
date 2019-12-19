using System;
using System.Linq.Expressions;
using System.Reflection;
using ExpenseSplitter.Api.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExpenseSplitter.Api.Data
{
    public class Context : DbContext
    {
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Trip> Trips { get; set; }
        public virtual DbSet<TripUser> TripsUsers { get; set; }
        public virtual DbSet<Participant> TripsParticipants { get; set; }
        public virtual DbSet<Expense> Expenses { get; set; }
        public virtual DbSet<ExpensePart> ExpensesParts { get; set; }
        public virtual DbSet<ExpensePartParticipant> ExpensesPartsParticipants { get; set; }

        public Context(DbContextOptions<Context> options) : base(options)
        {
        }

        private static LambdaExpression GetIsDeletedRestriction(Type type)
        {
            var propertyMethod = typeof(EF).GetMethod(nameof(EF.Property), BindingFlags.Static | BindingFlags.Public).MakeGenericMethod(typeof(DateTime?));
            var parm = Expression.Parameter(type, "it");
            var prop = Expression.Call(propertyMethod, parm, Expression.Constant("DeletedAt"));
            var condition = Expression.MakeBinary(ExpressionType.Equal, prop, Expression.Constant(null));
            var lambda = Expression.Lambda(condition, parm);
            return lambda;
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            foreach (var entity in modelBuilder.Model.GetEntityTypes())
            {
                if (typeof(SoftDeletesEntity).IsAssignableFrom(entity.ClrType))
                    modelBuilder.Entity(entity.ClrType).HasQueryFilter(GetIsDeletedRestriction(entity.ClrType));
            }

            base.OnModelCreating(modelBuilder);
        }

        public override int SaveChanges()
        {
            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.Entity is CreatedAtEntity && entry.State == EntityState.Added)
                    ((CreatedAtEntity)entry.Entity).CreatedAt = DateTime.Now;

                if (entry.Entity is UpdatedAtEntity && (entry.State == EntityState.Added || entry.State == EntityState.Modified))
                    ((UpdatedAtEntity)entry.Entity).UpdatedAt = DateTime.Now;

                if (entry.Entity is SoftDeletesEntity && entry.State == EntityState.Deleted)
                {
                    entry.State = EntityState.Modified;
                    ((SoftDeletesEntity)entry.Entity).DeletedAt = DateTime.Now;
                }
            }

            return base.SaveChanges();
        }
    }
}
