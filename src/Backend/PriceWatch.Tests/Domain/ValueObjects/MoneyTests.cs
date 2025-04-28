using FluentAssertions;
using PriceWatch.Domain.ValueObjects;
using PriceWatch.Domain.Exceptions;
using Xunit;

namespace PriceWatch.Tests.Domain.ValueObjects;

public class MoneyTests
{
    [Fact] public void NegativeAmount_Throws() =>
        FluentActions.Invoking(() => new Money(-1, "BRL"))
            .Should().Throw<DomainException>();

    [Fact] public void CurrencyLength_Wrong_Throws() =>
        FluentActions.Invoking(() => new Money(10, "REAIS"))
            .Should().Throw<DomainException>();

    [Fact] public void ValidAmount_Works() =>
        new Money(10.99m, "usd").Currency.Should().Be("USD");
}
