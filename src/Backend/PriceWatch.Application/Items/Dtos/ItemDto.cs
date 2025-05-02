// src/Backend/PriceWatch.Application/Items/Dtos/ItemDto.cs
namespace PriceWatch.Application.Items.Dtos;

public class ItemDto
{
    public Guid     Id              { get; set; }
    public string   Name            { get; set; } = default!;
    public int      Category        { get; set; }
    public string   DefaultCurrency { get; set; } = default!;
    public decimal? LatestPrice     { get; set; }
}
