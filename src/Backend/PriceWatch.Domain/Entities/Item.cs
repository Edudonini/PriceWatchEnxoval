using System.Data.Common;
using PriceWatch.Domain.Exceptions;

namespace PriceWatch.Domain.Entities;

public sealed class Item
{
    private Item()
    {
        Name = string.Empty;
        DefaultCurrency = string.Empty;
    }


    private Item(Guid id, string name, Category category, string currency)
    {
        Id = id;
        Name = name.ToUpperInvariant();
        Category = category;
        DefaultCurrency = currency.ToUpperInvariant();
    }

    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public Category Category { get; private set;}
    public string DefaultCurrency { get; private set;}

    public ICollection<PriceHistory> PriceHistory { get; private set; } = new List<PriceHistory>();

    public static Item Create(string? name, Category category, string? currency)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("name is required.");
        
        if (string.IsNullOrWhiteSpace(currency) || currency.Length != 3)
            throw new DomainException("Currency must be 3 letters.");

        return new Item(Guid.NewGuid(), name.Trim().ToUpperInvariant(), category, currency.ToUpperInvariant());    
    }

    public void Update(string name, Category category, string currencyIso)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("name cannot be empty", nameof(name));
        
        if (currencyIso.Length != 3)
            throw new ArgumentException("Currency must be 3 letters.", nameof(currencyIso));

        Name = name.Trim().ToUpperInvariant();
        Category = category;
        DefaultCurrency = currencyIso.ToUpperInvariant();
    }
}