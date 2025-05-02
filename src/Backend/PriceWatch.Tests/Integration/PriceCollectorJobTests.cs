using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using NSubstitute;
using PriceWatch.Domain.Entities;
using PriceWatch.Infrastructure.Jobs;
using PriceWatch.Infrastructure.Persistence;
using PriceWatch.Infrastructure.Services; 
using Xunit;

namespace PriceWatch.Tests.Integration
{
    public class PriceCollectorJobTests
    {
        [Fact(DisplayName = "RunAsync deve persistir novo PriceHistory para cada item")]
        public async Task RunAsync_Persists_PriceHistory()
        {
            // 1) Configura um DbContext em memória
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase("price-collector-job-test")
                .Options;

            await using var ctx = new AppDbContext(options);

            // 2) Cria e salva um item
            var item = Item.Create("Ferro", Category.Electronics, "BRL");
            ctx.Items.Add(item);
            await ctx.SaveChangesAsync();

            // 3) Cria um fake do scraper que sempre retorna 199.90
            var fakeScraper = Substitute.For<IRetailerScraper>();
            fakeScraper
                .GetPriceAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
                .Returns(199.90m);

            // 4) Instancia o job com o contexto e o fake
            var job = new PriceCollectorJob(ctx, fakeScraper);

            // 5) Executa o job
            await job.RunAsync(CancellationToken.None);

            // 6) Verifica que o PriceHistory foi adicionado
            var histories = await ctx.PriceHistories.ToListAsync();
            histories.Should()
                     .ContainSingle(ph => ph.ItemId == item.Id
                                       && ph.Price.Amount == 199.90m);
        }
    }
}
