using PriceWatch.Domain.ValueObjects;

namespace PriceWatch.Domain.Entities;

public sealed class PriceHistory
{
    private PriceHistory()
    {
        Price = new Money(0, "BRL"); 
    }
                    

    private PriceHistory(Guid id, Guid itemId, Money price, DateTime capturedAtUtc)
    {
        Id            = id;
        ItemId        = itemId;
        Price         = price;
        CapturedAtUtc = capturedAtUtc;
    }

    public Guid     Id            { get; private set; }
    public Guid     ItemId        { get; private set; }
    public Money    Price         { get; private set; }
    public DateTime CapturedAtUtc { get; private set; }

    public static PriceHistory Capture(Guid itemId, Money priceUtcNow) =>
        new(Guid.NewGuid(), itemId, priceUtcNow, DateTime.UtcNow);
}
