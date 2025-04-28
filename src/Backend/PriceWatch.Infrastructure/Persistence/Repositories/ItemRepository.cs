using Microsoft.EntityFrameworkCore;
using PriceWatch.Domain.Entities;

namespace PriceWatch.Infrastructure.Persistence.Repositories;

public class ItemRepository
{
    private readonly AppDbContext _ctx;
    public ItemRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<Item> AddAsync(Item item, CancellationToken ct = default)
    {
        _ctx.Items.Add(item);
        await _ctx.SaveChangesAsync(ct);
        return item;
    }

    public Task<List<Item>> GetAllAsync(CancellationToken ct = default) =>
        _ctx.Items.AsNoTracking().ToListAsync(ct);
}
