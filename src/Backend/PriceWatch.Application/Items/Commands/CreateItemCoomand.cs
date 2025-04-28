using MediatR;
using PriceWatch.Domain.Entities;
using PriceWatch.Infrastructure.Persistence.Repositories;

namespace PriceWatch.Application.Items.Commands;

public record CreateItemCommand(string Name, Category Category, string Currency) : IRequest<Item>;

public class CreateItemHandler : IRequestHandler<CreateItemCommand, Item>
{
    private readonly ItemRepository _repo;
    public CreateItemHandler(ItemRepository repo) => _repo = repo;

    public Task<Item> Handle(CreateItemCommand cmd, CancellationToken ct)
    {
        var item = Item.Create(cmd.Name, cmd.Category, cmd.Currency);
        return _repo.AddAsync(item, ct);
    }
}
