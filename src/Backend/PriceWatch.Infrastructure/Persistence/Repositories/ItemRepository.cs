// src/Backend/PriceWatch.Infrastructure/Persistence/Repositories/ItemRepository.cs
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PriceWatch.Domain.Entities;
using PriceWatch.Domain.Repositories;

namespace PriceWatch.Infrastructure.Persistence.Repositories;

public class ItemRepository : IItemRepository
{
    private readonly AppDbContext _ctx;
    public ItemRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<Item> AddAsync(Item item, CancellationToken ct = default)
    {
        _ctx.Items.Add(item);
        await _ctx.SaveChangesAsync(ct);
        return item;
    }

    public Task<Item?> GetAsync(Guid id, CancellationToken ct = default) =>
        _ctx.Items
            .Include(i => i.PriceHistory)
            .FirstOrDefaultAsync(i => i.Id == id, ct);

    public Task<List<Item>> GetAllAsync(CancellationToken ct = default) =>
        _ctx.Items.AsNoTracking().ToListAsync(ct);

    public async Task SaveAsync(Item item, CancellationToken ct = default)
    {
        _ctx.Update(item);
        await _ctx.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await _ctx.Items.FindAsync(new object[] { id }, ct);
        if (entity is not null)
            _ctx.Items.Remove(entity);

        await _ctx.SaveChangesAsync(ct);
    }
}
