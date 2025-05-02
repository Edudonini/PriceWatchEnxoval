using Xunit;
using FluentAssertions;
using Moq;
using MediatR;
using PriceWatch.Application.Items.Commands;
using PriceWatch.Application.Common.Exceptions;
using PriceWatch.Domain.Entities;
using PriceWatch.Domain.Repositories;

namespace PriceWatch.Tests.Application.Items;

public sealed class DeleteItemHandlerTests
{
    private readonly Mock<IItemRepository> _repo = new();

    [Fact(DisplayName = "Delete: remove item existente")]
    public async Task Handle_ExistingItem_DeletesSuccessfully()
    {
        // Arrange
        var id   = Guid.NewGuid();
        var item = Item.Create("Ferro", Category.Electronics, "BRL");
        // Quando buscar pelo id, devolve o item
        _repo.Setup(r => r.GetAsync(id, default)).ReturnsAsync(item);
        // DeleteAsync não retorna nada, mas vamos monitorar a chamada
        _repo.Setup(r => r.DeleteAsync(id, default)).Returns(Task.CompletedTask);

        var handler = new DeleteItemHandler(_repo.Object);

        // Act
        await handler.Handle(new DeleteItemCommand(id), default);

        // Assert: verifique que DeleteAsync foi invocado
        _repo.Verify(r => r.DeleteAsync(id, default), Times.Once);
    }

    [Fact(DisplayName = "Delete: item inexistente lança NotFoundException")]
    public async Task Handle_NonexistentItem_ThrowsNotFoundException()
    {
        // Arrange: GetAsync retorna null
        _repo.Setup(r => r.GetAsync(It.IsAny<Guid>(), default)).ReturnsAsync((Item?)null);
        var handler = new DeleteItemHandler(_repo.Object);

        // Act & Assert
        await FluentActions
            .Invoking(() => handler.Handle(new DeleteItemCommand(Guid.NewGuid()), default))
            .Should().ThrowAsync<NotFoundException>();
    }
}
