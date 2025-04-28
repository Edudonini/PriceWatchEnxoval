using MediatR;
using PriceWatch.Application.Items.Commands;
using PriceWatch.Application.Items.Queries;
using PriceWatch.Infrastructure.Extensions;
using Hangfire;
using Hangfire.SqlServer;
using PriceWatch.Infrastructure.Jobs;
using PriceWatch.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Connection-string para SQL Server local / Windows Auth
var connString = builder.Configuration.GetConnectionString("Sql") ??
                 "Server=localhost\\SQLEXPRESS;Database=PriceWatch;Trusted_Connection=True;TrustServerCertificate=True";

builder.Services.AddInfrastructure(connString);
builder.Services.AddMediatR(typeof(CreateItemCommand));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHangfire(cfg =>
    cfg.SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
       .UseSimpleAssemblyNameTypeSerializer()
       .UseRecommendedSerializerSettings()
       .UseSqlServerStorage(connString));

builder.Services.AddHangfireServer();



var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();

app.MapPost("/items", async (CreateItemCommand cmd, IMediator med) =>
    Results.Ok(await med.Send(cmd)));

app.MapGet("/items", async (IMediator med) =>
    Results.Ok(await med.Send(new GetItemsQuery())));

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
