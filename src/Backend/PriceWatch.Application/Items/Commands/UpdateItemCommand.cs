using MediatR;
using PriceWatch.Application.Items.Dtos;
using PriceWatch.Domain.Entities;

namespace PriceWatch.Application.Items.Commands;

public record UpdateItemCommand(
    Guid Id,
    string Name,
    Category Category,
    string Currency
) : IRequest<ItemDto>;
