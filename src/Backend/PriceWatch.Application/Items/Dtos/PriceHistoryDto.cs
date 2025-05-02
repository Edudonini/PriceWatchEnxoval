namespace PriceWatch.Application.Items.Dtos;

public sealed class PriceHistoryDto          
{
    public PriceHistoryDto() { }

    public Guid     Id            { get; init; }
    public decimal  Amount        { get; init; }
    public DateTime CapturedAtUtc { get; init; }
}
