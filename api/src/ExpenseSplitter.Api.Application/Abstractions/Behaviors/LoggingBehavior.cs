using ExpenseSplitter.Api.Domain.Abstractions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ExpenseSplitter.Api.Application.Abstractions.Behaviors;

public class LoggingBehavior<TRequest, TResponse>(ILogger<TRequest> logger) : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest
    where TResponse : Result
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (logger.IsEnabled(LogLevel.Information))
        {
            var requestName = request.GetType().Name;
            logger.LogInformation("Processing request {RequestName}", requestName);
        }

        var result = await next(cancellationToken);

        if (result.IsFailure)
        {
            if (logger.IsEnabled(LogLevel.Error))
            {
                logger.LogError(
                    "Request failure {RequestName}, {Error}, {DateTimeUtc}",
                    typeof(TRequest).Name,
                    result.AppError,
                    DateTime.UtcNow
                );
            }
        }
        else
        {
            if (logger.IsEnabled(LogLevel.Information))
            {
                logger.LogInformation(
                    "Request success {RequestName}, {DateTimeUtc}",
                    typeof(TRequest).Name,
                    DateTime.UtcNow
                );
            }
        }
        
        return result;
    }
}
