using FluentAssertions;
using PriceWatch.Domain.Exceptions;
using PriceWatch.Domain.ValueObjects;
using Xunit;

namespace PriceWatch.Tests.Domain.ValueObjects;

public class MoneyTests
{
    [Theory]
    [InlineData(0)]
    [InlineData(123.45)]
    public void Create_ValidAmount_ShouldSucceed(decimal amount)
    {
        // Act
        var money = new Money(amount, "BRL");

        // Assert
        money.Amount.Should().Be(amount);
        money.Currency.Should().Be("BRL");
    }

    [Theory]
    [InlineData(-0.01)]
    [InlineData(-10)]
    public void Create_NegativeAmount_ShouldThrow(decimal amount)
    {
        // Act
        var act = () => new Money(amount, "USD");

        // Assert
        act.Should().Throw<DomainException>()
           .WithMessage("*negative*");
    }

    [Fact]
    public void Equality_ShouldCompareAmountAndCurrency()
    {
        var m1 = new Money(10, "USD");
        var m2 = new Money(10, "USD");
        var m3 = new Money(10, "BRL");

        m1.Should().Be(m2);
        m1.Should().NotBe(m3);
    }
}
