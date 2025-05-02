// src/Backend/PriceWatch.Application/Items/Commands/CreateItemCommand.cs
using AutoMapper;
using MediatR;
using PriceWatch.Application.Items.Dtos;
using PriceWatch.Domain.Entities;
using PriceWatch.Domain.Repositories;

namespace PriceWatch.Application.Items.Commands;

public record CreateItemCommand(string Name, Category Category, string Currency)
    : IRequest<ItemDto>;     // <— agora retorna DTO e não Entity

public class CreateItemHandler : IRequestHandler<CreateItemCommand, ItemDto>
{
    private readonly IItemRepository _repo;
    private readonly IMapper _mapper;

    public CreateItemHandler(IItemRepository repo, IMapper mapper)
        => (_repo, _mapper) = (repo, mapper);

    public async Task<ItemDto> Handle(CreateItemCommand cmd, CancellationToken ct)
    {
        // 1) Cria a entidade no domínio
        var item = Item.Create(cmd.Name, cmd.Category, cmd.Currency);

        // 2) Persiste no banco
        await _repo.AddAsync(item, ct);

        // 3) Mapeia para DTO e devolve
        return _mapper.Map<ItemDto>(item);
    }
}
