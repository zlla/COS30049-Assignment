namespace Server.Helpers;

using Microsoft.EntityFrameworkCore;
using Server.Models;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<AccessToken> AccessTokens { get; set; }
    public DbSet<Wallet> Wallets { get; set; }
    public DbSet<Asset> Assets { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.Username).IsUnique();

        // Set relationships
        modelBuilder.Entity<User>()
            .HasMany(u => u.RefreshTokens).WithOne(rt => rt.User).HasForeignKey(rt => rt.UserId);

        modelBuilder.Entity<RefreshToken>()
            .HasMany(rt => rt.AccessTokens).WithOne(at => at.RefreshToken).HasForeignKey(at => at.RtId);

        modelBuilder.Entity<User>()
            .HasMany(u => u.Wallets).WithOne(w => w.User).HasForeignKey(w => w.UserId);

        modelBuilder.Entity<Wallet>()
            .HasMany(w => w.Assets).WithOne(a => a.Wallet).HasForeignKey(a => a.WalletId);
    }
}

