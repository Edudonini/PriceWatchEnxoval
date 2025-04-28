using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PriceWatch.Infrastructure.Jobs;
using PriceWatch.Infrastructure.Persistence;
using PriceWatch.Infrastructure.Persistence.Repositories;
using PriceWatch.Infrastructure.Services;

namespace PriceWatch.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection svcs, string conn)
    {
        svcs.AddDbContext<AppDbContext>(opt =>
            opt.UseSqlServer(conn));
        svcs.AddScoped<ItemRepository>();
        svcs.AddScoped<IRetailerScraper, RetailerScraper>();          // ⬅️ novo
        svcs.AddScoped<PriceCollectorJob>();  
        return svcs;
    }
}