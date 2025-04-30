using MediatR;
using PriceWatch.Application.Items.Dtos;

namespace PriceWatch.Application.Items.Commands;

public record UpdateItemCommand(
    Guid Id,
    string Name,
    int Category,
    string Currency
) : IRequest<ItemDto>;
