using AutoMapper;
using MediatR;
using PriceWatch.Application.Common.Exceptions;
using PriceWatch.Application.Items.Dtos;
using PriceWatch.Domain.Entities;
using PriceWatch.Domain.Repositories;

namespace PriceWatch.Application.Items.Commands;

public class UpdateItemHandler : IRequestHandler<UpdateItemCommand, ItemDto>
{
    private readonly IItemRepository _repo;
    private readonly IMapper _map;

    public UpdateItemHandler(IItemRepository repo, IMapper map)
        => (_repo, _map) = (repo, map);

    public async Task<ItemDto> Handle(UpdateItemCommand c, CancellationToken ct)
    {
        var item = await _repo.GetAsync(c.Id, ct)
                   ?? throw new NotFoundException(nameof(Item), c.Id);

        item.Update(c.Name, (Category)c.Category, c.Currency);   // regra agregada
        await _repo.SaveAsync(item, ct);

        return _map.Map<ItemDto>(item);
    }
}
