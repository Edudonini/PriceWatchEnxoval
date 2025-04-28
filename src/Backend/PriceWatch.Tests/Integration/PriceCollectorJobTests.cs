using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using PriceWatch.Domain.Entities;
using PriceWatch.Infrastructure.Jobs;
using PriceWatch.Infrastructure.Persistence;
using PriceWatch.Infrastructure.Persistence.Repositories;
using PriceWatch.Infrastructure.Services;
using Xunit;
using NSubstitute;

namespace PriceWatch.Tests.Integration;

public class PriceCollectorJobTests
{
    [Fact]
    public async Task Job_Persists_PriceHistory()
    {
        // arrange – contexto em memória
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("job-test")
            .Options;
        await using var ctx = new AppDbContext(options);

        var item = Item.Create("Ferro", Category.Electronics, "BRL");
        ctx.Items.Add(item);
        await ctx.SaveChangesAsync();

        var fakeScraper = Substitute.For<IRetailerScraper>();
        fakeScraper.GetPriceAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
                   .Returns(199.90m);

        var job = new PriceCollectorJob(ctx, fakeScraper);

        // act
        await job.RunAsync();

        // assert
        ctx.PriceHistories.Should().ContainSingle(ph => ph.ItemId == item.Id);
    }
}
