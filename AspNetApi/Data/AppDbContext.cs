using ExpenceManagement.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenceManagement.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Budget> Budgets => Set<Budget>();
        public DbSet<Expense> Expenses => Set<Expense>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Budget>(entity =>
            {
                entity.Property(b => b.Name).IsRequired().HasMaxLength(200);
                entity.Property(b => b.Limit).HasColumnType("decimal(18,2)");
            });

            modelBuilder.Entity<Expense>(entity =>
            {
                entity.Property(e => e.Description).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
                entity.HasOne(e => e.Budget)
                    .WithMany()
                    .HasForeignKey(e => e.BudgetId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}



