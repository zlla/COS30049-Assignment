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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.Username).IsUnique();


        //set relationships
        modelBuilder.Entity<User>()
            .HasMany(u => u.RefreshTokens).WithOne(rt => rt.User).HasForeignKey(rt => rt.UserId);

        modelBuilder.Entity<RefreshToken>()
            .HasMany(rt => rt.AccessTokens).WithOne(at => at.RefreshToken).HasForeignKey(at => at.RtId);
    }
}

