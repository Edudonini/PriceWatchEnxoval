using Microsoft.EntityFrameworkCore;
using PriceWatch.Domain.Entities;

namespace PriceWatch.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> o) : base(o) { }

    public DbSet<Item>         Items          => Set<Item>();
    public DbSet<PriceHistory> PriceHistories => Set<PriceHistory>();
    public DbSet<AlertRule>    AlertRules     => Set<AlertRule>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Item>(e =>
        {
            e.ToTable("Items");
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).IsRequired().HasMaxLength(120);
            e.Property(x => x.DefaultCurrency).HasMaxLength(3);
        });

        b.Entity<PriceHistory>(e =>
        {
            e.ToTable("PriceHistory");
            e.HasKey(x => x.Id);
            e.OwnsOne(x => x.Price, mv =>
            {
                mv.Property(p => p.Amount).HasColumnName("Amount");
                mv.Property(p => p.Currency).HasColumnName("Currency").HasMaxLength(3);
            });
            e.HasIndex(x => new { x.ItemId, x.CapturedAtUtc });
        });

        b.Entity<AlertRule>(e =>
        {
            e.ToTable("AlertRules");
            e.HasKey(x => x.Id);
            e.Property(x => x.Enabled);
            e.OwnsOne(x => x.TargetPrice, mv =>
            {
                mv.Property(p => p.Amount).HasColumnName("TargetAmount");
                mv.Property(p => p.Currency).HasColumnName("TargetCurrency").HasMaxLength(3);
            });
        });
    }
}
