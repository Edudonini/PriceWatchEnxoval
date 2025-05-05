using Microsoft.EntityFrameworkCore;
using Polly;
using Polly.CircuitBreaker;
using Polly.Retry;
using PriceWatch.Domain.Entities;
using PriceWatch.Domain.Repositories;

namespace PriceWatch.Infrastructure.Persistence.Repositories;

public class ResilientItemRepository : IItemRepository
{
    private readonly IItemRepository _inner;
    private readonly AsyncRetryPolicy _retryPolicy;
    private readonly AsyncCircuitBreakerPolicy _circuitBreakerPolicy;

    public ResilientItemRepository(IItemRepository inner)
    {
        _inner = inner;

        // Política de retry para falhas transitórias do SQL Server
        _retryPolicy = Policy
            .Handle<DbUpdateException>()
            .Or<DbUpdateConcurrencyException>()
            .WaitAndRetryAsync(
                retryCount: 5,
                sleepDurationProvider: attempt => TimeSpan.FromSeconds(Math.Pow(2, attempt)),
                onRetry: (exception, timeSpan, retryCount, context) =>
                {
                    Serilog.Log.Warning(
                        exception,
                        "Tentativa {RetryCount} falhou após {TimeSpan}ms. Tentando novamente...",
                        retryCount,
                        timeSpan.TotalMilliseconds);
                });

        // Circuit breaker para evitar sobrecarga do banco
        _circuitBreakerPolicy = Policy
            .Handle<DbUpdateException>()
            .CircuitBreakerAsync(
                exceptionsAllowedBeforeBreaking: 3,
                durationOfBreak: TimeSpan.FromSeconds(30),
                onBreak: (exception, duration) =>
                {
                    Serilog.Log.Warning(
                        "Circuito aberto por {Duration}ms devido a: {Exception}",
                        duration.TotalMilliseconds,
                        exception.Message);
                },
                onReset: () =>
                {
                    Serilog.Log.Information("Circuito fechado novamente");
                });
    }

    public async Task<Item> AddAsync(Item item, CancellationToken ct = default)
    {
        return await _retryPolicy.ExecuteAsync(async () =>
            await _circuitBreakerPolicy.ExecuteAsync(async () =>
                await _inner.AddAsync(item, ct)));
    }

    public async Task<Item?> GetAsync(Guid id, CancellationToken ct = default)
    {
        return await _retryPolicy.ExecuteAsync(async () =>
            await _circuitBreakerPolicy.ExecuteAsync(async () =>
                await _inner.GetAsync(id, ct)));
    }

    public async Task<List<Item>> GetAllAsync(CancellationToken ct = default)
    {
        return await _retryPolicy.ExecuteAsync(async () =>
            await _circuitBreakerPolicy.ExecuteAsync(async () =>
                await _inner.GetAllAsync(ct)));
    }

    public async Task SaveAsync(Item item, CancellationToken ct = default)
    {
        await _retryPolicy.ExecuteAsync(async () =>
            await _circuitBreakerPolicy.ExecuteAsync(async () =>
                await _inner.SaveAsync(item, ct)));
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        await _retryPolicy.ExecuteAsync(async () =>
            await _circuitBreakerPolicy.ExecuteAsync(async () =>
                await _inner.DeleteAsync(id, ct)));
    }
} 