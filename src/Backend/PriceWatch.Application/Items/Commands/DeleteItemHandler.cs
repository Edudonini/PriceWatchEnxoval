using MediatR;
using PriceWatch.Domain.Repositories;

namespace PriceWatch.Application.Items.Commands;

public class DeleteItemHandler : IRequestHandler<DeleteItemCommand>
{
    private readonly IItemRepository _repo;
    public DeleteItemHandler(IItemRepository repo) => _repo = repo;

    public async Task<Unit> Handle(DeleteItemCommand c, CancellationToken ct)
    {
        await _repo.DeleteAsync(c.Id, ct);
        return Unit.Value;
    }
}