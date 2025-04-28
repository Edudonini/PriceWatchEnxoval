using MediatR;
using PriceWatch.Domain.Entities;
using PriceWatch.Infrastructure.Persistence.Repositories;

namespace PriceWatch.Application.Items.Queries;

public record GetItemsQuery : IRequest<List<Item>>;

public class GetItemsHandler : IRequestHandler<GetItemsQuery, List<Item>>
{
    private readonly ItemRepository _repo;
    public GetItemsHandler(ItemRepository repo) => _repo = repo;
    public Task<List<Item>> Handle(GetItemsQuery q, CancellationToken ct) =>
        _repo.GetAllAsync(ct);
}
