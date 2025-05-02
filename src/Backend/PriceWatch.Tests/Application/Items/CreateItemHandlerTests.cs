using Xunit;
using FluentAssertions;
using Moq;
using AutoMapper;
using MediatR;
using PriceWatch.Application.Items.Commands;
using PriceWatch.Application.Items.Dtos;
using PriceWatch.Application.Items.Mapping;
using PriceWatch.Domain.Entities;
using PriceWatch.Domain.Repositories;

namespace PriceWatch.Tests.Application.Items;

public sealed class CreateItemHandlerTests
{
    private readonly IMapper _mapper;
    private readonly Mock<IItemRepository> _repo = new();

    public CreateItemHandlerTests()
    {
        // Configuramos o AutoMapper para usar o mesmo profile de produção
        var cfg = new MapperConfiguration(c => c.AddProfile<ItemsProfile>());
        _mapper = cfg.CreateMapper();
    }

    [Fact(DisplayName = "Create: adiciona item e devolve DTO mapeado")]
    public async Task Handle_CreateNewItem_ReturnsDto()
    {
        // 1) Arrange: preparamos o comando de criação e capturamos o que o repo deve retornar
        var cmd = new CreateItemCommand("Batedeira", Category.Kitchen, "BRL");
        // O repositório, quando AddAsync for chamado, deve retornar um Item com Id (simulamos)
        _repo
          .Setup(r => r.AddAsync(It.IsAny<Item>(), default))
          .ReturnsAsync((Item it, CancellationToken _) => it);

        // 2) Instanciaremos o handler com a repo mockada e o mapper real
        var handler = new CreateItemHandler(_repo.Object, _mapper);

        // 3) Act: executamos
        var dto = await handler.Handle(cmd, default);

        // 4) Assert:
        // - O DTO não é nulo e reflete a transformação (nome em maiúsculas, categoria index, etc).
        dto.Should().NotBeNull();
        dto.Name.Should().Be("BATEDEIRA");
        dto.Category.Should().Be((int)Category.Kitchen);
        dto.DefaultCurrency.Should().Be("BRL");

        // - Verificamos que o repositório foi chamado exatamente uma vez
        _repo.Verify(r => r.AddAsync(It.IsAny<Item>(), default), Times.Once);
    }
}
