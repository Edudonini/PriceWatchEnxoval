namespace PriceWatch.Application.Items.Dtos;

public record ItemDto
(
    Guid Id,
    string Name,
    int Category,
    string DefaultCurrency,
    decimal? LatestPrice
);