using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ExpenseSplitter.Api.Data;
using ExpenseSplitter.Api.Services;
using Frugal.Api.Providers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Pomelo.EntityFrameworkCore.MySql.Storage;

namespace ExpenseSplitter.Api
{
    public class Startup
    {
        private readonly IConfiguration _configuration;

        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            services.AddDbContextPool<Context>(options => options
                .UseMySql(_configuration.GetConnectionString("Context"), mySqlOptions => mySqlOptions
                    .ServerVersion(new ServerVersion(new Version(10, 1, 43), ServerType.MySql))
            ));

            services.AddScoped<IExpenseService, ExpenseService>();
            services.AddScoped<ITripService, TripService>();
            services.AddScoped<IUserService, UserService>();

            var config = new ConfigProvider();
            _configuration.Bind("Configuration", config);
            services.AddSingleton<IConfigProvider>(config);
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, Context context)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            context.Database.Migrate();
            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
