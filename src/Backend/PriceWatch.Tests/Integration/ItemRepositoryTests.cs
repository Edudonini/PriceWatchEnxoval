using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using PriceWatch.Domain.Entities;
using PriceWatch.Infrastructure.Persistence;
using PriceWatch.Infrastructure.Persistence.Repositories;
using Xunit;

namespace PriceWatch.Tests.Integration;

public class ItemRepositoryTests
{
    [Fact]
    public async Task Add_And_GetAll_Work()
    {
        var opts = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("pw-test")
            .Options;
        await using var ctx = new AppDbContext(opts);
        var repo = new ItemRepository(ctx);

        await repo.AddAsync(Item.Create("Torradeira", Category.Kitchen, "BRL"));
        var list = await repo.GetAllAsync();

        list.Should().ContainSingle(i => i.Name == "TORRADEIRA");
    }
}
