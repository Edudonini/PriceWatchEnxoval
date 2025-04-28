using PriceWatch.Domain.ValueObjects;

namespace PriceWatch.Domain.Entities;

public sealed class AlertRule
{
    private AlertRule()
    {
        TargetPrice = new Money(0, "BRL");
    }

    private AlertRule(Guid id, Guid itemId, Money targetPrice)
    {
        Id         = id;
        ItemId     = itemId;
        TargetPrice= targetPrice;
        Enabled    = true;
    }

    public Guid  Id          { get; private set; }
    public Guid  ItemId      { get; private set; }
    public Money TargetPrice { get; private set; }
    public bool  Enabled     { get; private set; }

    public static AlertRule Create(Guid itemId, Money target) =>
        new(Guid.NewGuid(), itemId, target);
}
