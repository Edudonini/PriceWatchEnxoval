using MediatR;
using PriceWatch.Application.Items.Dtos;

namespace PriceWatch.Application.Items.Queries;

public record GetPriceHistoryQuery(Guid ItemId)
    : IRequest<List<PriceHistoryDto>>;
