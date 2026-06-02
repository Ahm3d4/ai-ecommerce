// Data/AppDbContext.cs
using EcommerceApi.Models;
using Microsoft.EntityFrameworkCore;

namespace EcommerceApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // This property represents the Products table in MySQL
        public DbSet<Product> Products { get; set; }

        public DbSet<User> Users {get; set;}

        public DbSet<Wallet> Wallets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
           modelBuilder.Entity<User>()
        .HasOne(u => u.Wallet)
        .WithOne(w => w.User)
        .HasForeignKey<Wallet>(w => w.UserId)
        .OnDelete(DeleteBehavior.Cascade);
        }
    }
}