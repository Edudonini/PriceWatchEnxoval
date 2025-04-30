using AutoMapper;
using PriceWatch.Domain.Entities;
using PriceWatch.Application.Items.Dtos;

namespace PriceWatch.Application.Items.Mapping;

/// <summary>Mapeia entidade → DTO.</summary>
public class ItemsProfile : Profile
{
    public ItemsProfile()
    {
        CreateMap<Item, ItemDto>()
            .ForMember(d => d.Category,
                       opt => opt.MapFrom(s => (int)s.Category))
            .ForMember(d => d.LatestPrice,
           opt => opt.MapFrom(s =>
               s.PriceHistory
                .OrderByDescending(ph => ph.CapturedAtUtc)
                .Select(ph => (decimal?)ph.Price.Amount)
                .FirstOrDefault()
           )
);
    }
}
