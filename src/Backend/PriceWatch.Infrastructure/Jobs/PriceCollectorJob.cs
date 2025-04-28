using PriceWatch.Domain.Entities;
using PriceWatch.Infrastructure.Persistence;
using PriceWatch.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using PriceWatch.Domain.ValueObjects;

namespace PriceWatch.Infrastructure.Jobs;

public class PriceCollectorJob
{
    private readonly AppDbContext       _ctx;
    private readonly IRetailerScraper   _scraper;

    public PriceCollectorJob(AppDbContext ctx, IRetailerScraper scraper)
    {
        _ctx     = ctx;
        _scraper = scraper;
    }

    public async Task RunAsync(CancellationToken ct = default)
    {
        var items = await _ctx.Items.AsNoTracking().ToListAsync(ct);

        foreach (var item in items)
        {
            // TODO: armazenar URLs por varejista — hoje usaremos stub
            var price = await _scraper.GetPriceAsync("https://stub", ct);
            if (price is null) continue;

            var history = PriceHistory.Capture(item.Id, new Money(price.Value, item.DefaultCurrency));
            _ctx.PriceHistories.Add(history);
        }
        await _ctx.SaveChangesAsync(ct);
    }
}
