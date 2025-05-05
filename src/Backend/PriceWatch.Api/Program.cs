using MediatR;
using PriceWatch.Application.Items.Commands;
using PriceWatch.Application.Items.Queries;
using PriceWatch.Infrastructure.Extensions;
using Hangfire;
using Hangfire.SqlServer;
using PriceWatch.Infrastructure.Jobs;
using PriceWatch.Infrastructure.Persistence;
using PriceWatch.Domain.Repositories;
using PriceWatch.Infrastructure.Persistence.Repositories;
using PriceWatch.Application.Items.Mapping;
using Serilog;
using Serilog.Events;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using OpenTelemetry.Metrics;
using FluentValidation;
using PriceWatch.Application.Common.Behaviors;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using HealthChecks.UI.Client;

var builder = WebApplication.CreateBuilder(args);

// Configuração do Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/pricewatch-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Connection-string para SQL Server local / Windows Auth
var connString = builder.Configuration.GetConnectionString("Sql") ??
                 "Server=localhost\\SQLEXPRESS;Database=PriceWatch;Trusted_Connection=True;TrustServerCertificate=True";

// Configuração do OpenTelemetry
builder.Services.AddOpenTelemetry()
    .WithTracing(builder => builder
        .AddSource("PriceWatch")
        .SetResourceBuilder(ResourceBuilder.CreateDefault().AddService("PriceWatch"))
        .AddAspNetCoreInstrumentation()
        .AddEntityFrameworkCoreInstrumentation()
        .AddConsoleExporter())
    .WithMetrics(builder => builder
        .AddAspNetCoreInstrumentation()
        .AddConsoleExporter());

// Health Checks
builder.Services.AddHealthChecks()
    .AddSqlServer(connString, name: "sqlserver")
    .AddDbContextCheck<AppDbContext>();

builder.Services.AddInfrastructure(connString);

// Registrando validadores
builder.Services.AddValidatorsFromAssemblyContaining<CreateItemCommandValidator>();

// Configurando MediatR com pipeline behaviors
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssemblyContaining<CreateItemCommand>();
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
});

builder.Services.AddAutoMapper(typeof(ItemsProfile));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHangfire(cfg =>
    cfg.SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
       .UseSimpleAssemblyNameTypeSerializer()
       .UseRecommendedSerializerSettings()
       .UseSqlServerStorage(connString));

builder.Services.AddHangfireServer();

// Registrando o ItemRepository com resiliência
builder.Services.AddScoped<IItemRepository>(sp =>
{
    var inner = new ItemRepository(sp.GetRequiredService<AppDbContext>());
    return new ResilientItemRepository(inner);
});

var app = builder.Build();

// Health Check endpoints
app.MapHealthChecks("/healthz", new HealthCheckOptions
{
    ResponseWriter = HealthChecks.UI.Client.UIResponseWriter.WriteHealthCheckUIResponse
});

app.MapHealthChecks("/healthz/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready"),
    ResponseWriter = HealthChecks.UI.Client.UIResponseWriter.WriteHealthCheckUIResponse
});

app.MapHealthChecks("/healthz/live", new HealthCheckOptions
{
    Predicate = _ => false
});

app.UseSwagger();
app.UseSwaggerUI();

var api = app.MapGroup("/api");

api.MapPost("/items", async (CreateItemCommand cmd, IMediator med) =>
    Results.Ok(await med.Send(cmd)));

api.MapGet("/items", async (IMediator med) =>
    Results.Ok(await med.Send(new GetItemsQuery())));

api.MapPut("/items/{id:guid}",
    (Guid id, UpdateItemCommand cmd, ISender s)
        => s.Send(cmd with { Id = id }));

api.MapDelete("/items/{id:guid}",
    (Guid id, ISender s) => s.Send(new DeleteItemCommand(id)));

api.MapGet("/items/{id:guid}/history",
    async (Guid id, IMediator med) =>
        Results.Ok(await med.Send(new GetPriceHistoryQuery(id))));

app.UseHangfireDashboard("/jobs");      // painel protegido futuramente

RecurringJob.AddOrUpdate<PriceCollectorJob>(
    "collect-prices",
    job => job.RunAsync(CancellationToken.None),
    Cron.Hourly);

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated(); 
}
    

app.Run();
