namespace PriceWatch.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using PriceWatch.Domain.Entities;

public interface IItemRepository
{
    Task<Item> AddAsync(Item item, CancellationToken ct = default);
    Task<Item?> GetAsync(Guid id, CancellationToken ct = default);
    Task<List<Item>> GetAllAsync(CancellationToken ct = default);
    Task SaveAsync(Item item, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
