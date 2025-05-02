using System.Runtime.InteropServices;
using AutoMapper;
using PriceWatch.Application.Items.Dtos;
using PriceWatch.Domain.Entities;

namespace PriceWatch.Application.Items.Mapping;

// PriceHistoryProfile.cs
public sealed class PriceHistoryProfile : Profile
{
    public PriceHistoryProfile()
    {
        CreateMap<PriceHistory, PriceHistoryDto>()
            .ForMember(d => d.Amount,
                       opt => opt.MapFrom(s => s.Price.Amount));
    }
}
