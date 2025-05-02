using Xunit;
using FluentAssertions;                // asserts mais legíveis
using Moq;                             // criação de mocks
using AutoMapper;
using PriceWatch.Application.Items.Commands;
using PriceWatch.Application.Items.Dtos;
using PriceWatch.Application.Items.Mapping;
using PriceWatch.Domain.Entities;
using PriceWatch.Domain.Repositories;
using PriceWatch.Application.Common.Exceptions;

namespace PriceWatch.Tests.Application.Items; // <== namespace segue a pasta

public sealed class UpdateItemHandlerTests
{
    private readonly IMapper _mapper;
    private readonly Mock<IItemRepository> _repo = new();   // Mock já instanciado

    public UpdateItemHandlerTests()
    {
        var cfg = new MapperConfiguration(c => c.AddProfile<ItemsProfile>());
        _mapper = cfg.CreateMapper();
    }

    [Fact(DisplayName = "Atualiza item existente e devolve DTO mapeado")]
    public async Task Update_Ok()
    {
        // Arrange --------------------------------------------------------------
        var id   = Guid.NewGuid();
        var item = Item.Create("Torradeira", Category.Kitchen, "BRL");
        _repo.Setup(r => r.GetAsync(id, default)).ReturnsAsync(item);

        var handler = new UpdateItemHandler(_repo.Object, _mapper);
        var cmd     = new UpdateItemCommand(id, "Grill", Category.Kitchen, "BRL");

        // Act ------------------------------------------------------------------
        ItemDto dto = await handler.Handle(cmd, default);

        // Assert ---------------------------------------------------------------
        dto.Name.Should().Be("GRILL");               // regra de domínio (ToUpper)
        _repo.Verify(r => r.SaveAsync(item, default), Times.Once);
    }

    [Fact(DisplayName = "Item inexistente lança NotFoundException")]
    public async Task Update_NotFound()
    {
        var id   = Guid.NewGuid();

        var handler = new UpdateItemHandler(_repo.Object, _mapper);
        var cmd     = new UpdateItemCommand(Guid.NewGuid(), "X", Category.Kitchen, "BRL");

        await FluentActions.Invoking(() => handler.Handle(cmd, default))
            .Should().ThrowAsync<NotFoundException>();
    }
}
