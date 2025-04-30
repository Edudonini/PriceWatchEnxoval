namespace PriceWatch.Application.Common.Exceptions;

/// <summary>Exceção padrão 404</summary>

public class NotFoundException : Exception
{
    public NotFoundException(string name, object key)
    : base($"{name} ({key}) não foi encontrato.") {}
}