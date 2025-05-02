using MediatR;
using AutoMapper;
using PriceWatch.Application.Items.Dtos;
using PriceWatch.Domain.Repositories;
using PriceWatch.Domain.Entities;
using PriceWatch.Application.Common.Exceptions;

namespace PriceWatch.Application.Items.Queries;

public sealed class GetPriceHistoryHandler
    : IRequestHandler<GetPriceHistoryQuery, List<PriceHistoryDto>>
{
    private readonly IItemRepository _repo;
    private readonly IMapper _map;

    public GetPriceHistoryHandler(IItemRepository repo, IMapper map)
        => (_repo, _map) = (repo, map);

    public async Task<List<PriceHistoryDto>> Handle(
        GetPriceHistoryQuery q, CancellationToken ct)
    {
        var item = await _repo.GetAsync(q.ItemId, ct)
                   ?? throw new NotFoundException(nameof(Item), q.ItemId);

        return item.PriceHistory
                   .OrderByDescending(p => p.CapturedAtUtc)
                   .Select(p => _map.Map<PriceHistoryDto>(p))
                   .ToList();
    }
}
