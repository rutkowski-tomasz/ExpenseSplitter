﻿using System.Security.Claims;
using ExpenseSplitter.Api.Domain.Users;
using ExpenseSplitter.Api.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Testcontainers.PostgreSql;

namespace ExpenseSplitter.Api.IntegrationTests;

public class IntegrationTestWebAppFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private const string TestUserId = "00000000-0000-0000-0000-000000000000";
    private readonly PostgreSqlContainer postgreSqlContainer = new PostgreSqlBuilder()
        .WithImage("postgres:latest")
        .WithDatabase("expensesplitter")
        .WithUsername("admin")
        .WithPassword("admin")
        .Build();

    public async Task InitializeAsync()
    {
        await postgreSqlContainer.StartAsync();
        await SeedDatabaseAsync();
    }

    private async Task SeedDatabaseAsync()
    {
        using var scope = Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var user = User.Create("Test user", "test@test.com", new UserId(Guid.Parse(TestUserId))).Value;
        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureTestServices(services =>
        {
            var descriptor = services
                .SingleOrDefault(s => s.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));

            if (descriptor is not null)
            {
                services.Remove(descriptor);
            }

            services.AddDbContext<ApplicationDbContext>(options => options
                .UseNpgsql(postgreSqlContainer.GetConnectionString())
                .UseSnakeCaseNamingConvention()
            );

            ConfigureIHttpContextAccessor(services);
        });
    }

    private static void ConfigureIHttpContextAccessor(IServiceCollection services)
    {
        var httpContextAccessorDescriptor = services
            .Single(s => s.ServiceType == typeof(IHttpContextAccessor));

        services.Remove(httpContextAccessorDescriptor);

        var mockHttpContextAccessor = Substitute.For<IHttpContextAccessor>();
        var context = new DefaultHttpContext();
        
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity([
            new(ClaimTypes.NameIdentifier, TestUserId)
        ]));

        context.User = claimsPrincipal;
        mockHttpContextAccessor.HttpContext.Returns(context);

        services.AddTransient(_ => mockHttpContextAccessor);
    }

    public new Task DisposeAsync()
    {
        return postgreSqlContainer.StopAsync();
    }
}
