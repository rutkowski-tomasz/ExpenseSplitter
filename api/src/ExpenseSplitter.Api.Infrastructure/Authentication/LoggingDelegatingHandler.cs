using System.Diagnostics;
using Microsoft.Extensions.Logging;

namespace ExpenseSplitter.Api.Infrastructure.Authentication;

public class LoggingDelegatingHandler(ILogger<LoggingDelegatingHandler> logger) : DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        try
        {
            if (logger.IsEnabled(LogLevel.Information))
            {
                var requestContent = request.Content is null
                    ? string.Empty
                    : await request.Content.ReadAsStringAsync(cancellationToken);
                logger.LogInformation(
                    "Sending HTTP request to {Method} {Uri} with {Content}",
                    request.Method,
                    request.RequestUri,
                    requestContent
                );
            }

            var stopWatch = Stopwatch.StartNew();
            var result = await base.SendAsync(request, cancellationToken);

            if (logger.IsEnabled(LogLevel.Information))
            {
                var resultContent = await result.Content.ReadAsStringAsync(cancellationToken);
                logger.LogInformation(
                    "Received HTTP response {StatusCode} in {Duration}ms with {Content}",
                    result.StatusCode,
                    stopWatch.ElapsedMilliseconds,
                    resultContent
                );
            }

            return result;
        }
        catch (Exception e)
        {
            logger.LogError(e, "HTTP request failed");
            throw new HttpRequestException(e.Message, e);
        }
    }
}
