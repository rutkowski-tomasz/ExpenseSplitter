using ExpenseSplitter.Api.Application.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using BadHttpRequestException = Microsoft.AspNetCore.Http.BadHttpRequestException;

namespace ExpenseSplitter.Api.Presentation.Middleware;

public sealed class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        _logger.LogError(
            exception,
            "Exception occurred: {Message}",
            exception.Message);

        var problemDetails = GetProblemDetails(exception, httpContext);
        
        var problemDetailsService = httpContext.RequestServices.GetRequiredService<IProblemDetailsService>();
        
        await problemDetailsService.WriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            ProblemDetails = problemDetails
        });

        return true;
    }

    private static ProblemDetails GetProblemDetails(Exception exception, HttpContext httpContext)
    {
        return exception switch
        {
            BadHttpRequestException badHttpRequestException => new ProblemDetails
            {
                Instance = $"{httpContext.Request.Method} {httpContext.Request.Path}",
                Status = StatusCodes.Status400BadRequest,
                Type = "BadRequest",
                Title = "Bad request",
                Detail = badHttpRequestException.Message
            },
            ValidationException validationException => new ProblemDetails
            {
                Instance = $"{httpContext.Request.Method} {httpContext.Request.Path}",
                Status = StatusCodes.Status400BadRequest,
                Type = "ValidationFailure",
                Title = "Validation error",
                Detail = "One or more validation errors has occurred",
                Extensions = { ["errors"] = validationException.Errors }
            },
            _ => new ProblemDetails
            {
                Instance = $"{httpContext.Request.Method} {httpContext.Request.Path}",
                Status = StatusCodes.Status500InternalServerError,
                Type = "ServerError",
                Title = "Server error",
                Detail = "An unexpected error has occurred"
            }
        };
    }
} 
