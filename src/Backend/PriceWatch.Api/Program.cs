using MediatR;
using PriceWatch.Application.Items.Commands;
using PriceWatch.Application.Items.Queries;
using PriceWatch.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Connection-string para SQL Server local / Windows Auth
var connString = builder.Configuration.GetConnectionString("Sql") ??
                 "Server=localhost\\SQLEXPRESS;Database=PriceWatch;Trusted_Connection=True;TrustServerCertificate=True";

builder.Services.AddInfrastructure(connString);
builder.Services.AddMediatR(typeof(CreateItemCommand));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();

app.MapPost("/items", async (CreateItemCommand cmd, IMediator med) =>
    Results.Ok(await med.Send(cmd)));

app.MapGet("/items", async (IMediator med) =>
    Results.Ok(await med.Send(new GetItemsQuery())));

app.Run();
