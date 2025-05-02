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

var builder = WebApplication.CreateBuilder(args);

// Connection-string para SQL Server local / Windows Auth
var connString = builder.Configuration.GetConnectionString("Sql") ??
                 "Server=localhost\\SQLEXPRESS;Database=PriceWatch;Trusted_Connection=True;TrustServerCertificate=True";

builder.Services.AddInfrastructure(connString);
builder.Services.AddMediatR(typeof(CreateItemCommand));
builder.Services.AddAutoMapper(typeof(ItemsProfile));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHangfire(cfg =>
    cfg.SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
       .UseSimpleAssemblyNameTypeSerializer()
       .UseRecommendedSerializerSettings()
       .UseSqlServerStorage(connString));

builder.Services.AddHangfireServer();

builder.Services.AddScoped<IItemRepository, ItemRepository>();


var app = builder.Build();
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
