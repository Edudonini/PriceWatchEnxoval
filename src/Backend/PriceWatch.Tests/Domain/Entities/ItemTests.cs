using FluentAssertions;
using PriceWatch.Domain.Entities;
using PriceWatch.Domain.Exceptions;
using Xunit;

namespace PriceWatch.Tests.Domain.Entities;

public class ItemTests
{
    [Fact] public void EmptyName_Throws() =>
        FluentActions.Invoking(() => Item.Create("", Category.Other, "BRL"))
            .Should().Throw<DomainException>();

    [Fact] public void Valid_CreatesUppercase()
    {
        var item = Item.Create("Air fryer", Category.Kitchen, "brl");
        item.Name.Should().Be("AIR FRYER");
    }
}
