﻿using ExpenseSplitter.Api.Presentation.MediatrEndpoints;
using ExpenseSplitter.Api.Presentation.Middleware;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System.Reflection;

namespace ExpenseSplitter.Api.Presentation.Extensions;

public static class ServiceCollectionExtensions
{
    public static void AddEndpoints(this IServiceCollection services, Assembly assembly)
    {
        var serviceDescriptors = assembly
            .DefinedTypes
            .Where(type => type is { IsAbstract: false, IsInterface: false }
                && type.IsAssignableTo(typeof(EndpointBase)))
            .Select(type => ServiceDescriptor.Transient(typeof(EndpointBase), type))
            .ToArray();

        services.TryAddEnumerable(serviceDescriptors);
    }

    public static void AddExceptionHandlers(this IServiceCollection services)
    {
        services.AddExceptionHandler<GlobalExceptionHandler>();
        services.AddProblemDetails();
    }
}
