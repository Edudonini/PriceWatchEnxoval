using MediatR;

namespace PriceWatch.Application.Items.Commands;
public record DeleteItemCommand(Guid Id) : IRequest;