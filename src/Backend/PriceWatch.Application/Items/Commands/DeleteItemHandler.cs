using MediatR;
using PriceWatch.Application.Common.Exceptions;
using PriceWatch.Domain.Entities;
using PriceWatch.Domain.Repositories;

namespace PriceWatch.Application.Items.Commands;

public class DeleteItemHandler : IRequestHandler<DeleteItemCommand>
{
    private readonly IItemRepository _repo;
    public DeleteItemHandler(IItemRepository repo) => _repo = repo;

    public async Task<Unit> Handle(DeleteItemCommand cmd, CancellationToken ct)
    {
        // 1) Tenta recuperar — se não achar, lança NotFoundException:
        var item = await _repo.GetAsync(cmd.Id, ct)
                   ?? throw new NotFoundException(nameof(Item), cmd.Id);

        // 2) Se achou, exclui:
        await _repo.DeleteAsync(cmd.Id, ct);

        return Unit.Value;
    }
}