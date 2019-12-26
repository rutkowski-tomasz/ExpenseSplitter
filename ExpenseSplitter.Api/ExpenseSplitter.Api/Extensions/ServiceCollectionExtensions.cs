using System;
using System.Collections.Generic;
using System.Text;
using AspNetCoreRateLimit;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Infrastructure;
using ExpenseSplitter.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Pomelo.EntityFrameworkCore.MySql.Storage;

namespace ExpenseSplitter.Api.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IConfigProvider ConfigureConfigProvider(this IServiceCollection services, IConfiguration configuration)
        {
            var config = new ConfigProvider();
            configuration.Bind("Configuration", config);
            services.AddSingleton<IConfigProvider>(config);
            return config;
        }

        public static void ConfigureAppServices(this IServiceCollection services)
        {
            services.AddScoped<IExpenseService, ExpenseService>();
            services.AddScoped<ITripService, TripService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IBalanceService, BalanceService>();

            services.AddTransient<IPasswordHasher, PasswordHasher>();
            services.AddTransient<IUidGenerator, UidGenerator>();

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        }

        public static void ConfigureJwt(this IServiceCollection services, IConfigProvider config)
        {
            var key = config.AuthorizationSecretKey;
            services
                .AddAuthentication(x =>
                {
                    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(x =>
                {
                    x.RequireHttpsMetadata = false;
                    x.SaveToken = true;
                    x.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,

                        ValidIssuer = config.SecurityTokenIssuer,
                        ValidAudience = config.SecurityTokenAudience,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                    };
                });
        }

        public static void ConfigureDbContext(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<Context>(options =>
                options
                    .UseMySql(configuration.GetConnectionString("Context"), mySqlOptions => mySqlOptions
                    .ServerVersion(new ServerVersion(new Version(10, 1, 43), ServerType.MySql))
            ));
        }

        public static void ConfigureThrottling(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<IpRateLimitOptions>(configuration.GetSection("IpRateLimiting"));
        }
    }
}