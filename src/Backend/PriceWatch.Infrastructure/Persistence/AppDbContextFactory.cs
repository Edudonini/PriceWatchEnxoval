using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace PriceWatch.Infrastructure.Persistence;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var opts = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlServer(
                "Server=localhost\\SQLEXPRESS;Database=PriceWatchDesign;Trusted_Connection=True;TrustServerCertificate=True")
            .Options;

        return new AppDbContext(opts);
    }
}
