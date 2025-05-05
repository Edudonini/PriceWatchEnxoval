using FluentValidation;
using PriceWatch.Domain.Entities;

namespace PriceWatch.Application.Items.Commands;

public class UpdateItemCommandValidator : AbstractValidator<UpdateItemCommand>
{
    public UpdateItemCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(120);

        RuleFor(x => x.Category)
            .IsInEnum();

        RuleFor(x => x.Currency)
            .NotEmpty()
            .Length(3);
    }
} 