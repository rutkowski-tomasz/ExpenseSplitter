using ExpenseSplitter.Api.Application.Exceptions;
using ExpenseSplitter.Api.Presentation.Middleware;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using BadHttpRequestException = Microsoft.AspNetCore.Http.BadHttpRequestException;

namespace ExpenseSplitter.Api.Presentation.UnitTests.Middleware;

public class GlobalExceptionHandlerTests
{
    private readonly ILogger<GlobalExceptionHandler> _logger =
        Substitute.For<ILogger<GlobalExceptionHandler>>();
    private readonly IProblemDetailsService _problemDetailsService =
        Substitute.For<IProblemDetailsService>();
    private readonly GlobalExceptionHandler _handler;

    public GlobalExceptionHandlerTests()
    {
        _handler = new GlobalExceptionHandler(_logger);
    }

    [Fact]
    public async Task TryHandleAsync_ShouldReturnTrueAndHandle400BadRequest_WhenBadHttpRequestException()
    {
        // Arrange
        var context = CreateHttpContextWithProblemDetailsService();
        var exception = new BadHttpRequestException("Invalid request");

        // Act
        var result = await _handler.TryHandleAsync(context, exception, CancellationToken.None);

        // Assert
        result.Should().BeTrue();
        await _problemDetailsService.Received(1).WriteAsync(Arg.Is<ProblemDetailsContext>(pdc => 
            pdc.HttpContext == context &&
            pdc.ProblemDetails.Status == StatusCodes.Status400BadRequest &&
            pdc.ProblemDetails.Type == "BadRequest" &&
            pdc.ProblemDetails.Title == "Bad request" &&
            pdc.ProblemDetails.Detail == "Invalid request"));
    }

    [Fact]
    public async Task TryHandleAsync_ShouldReturnTrueAndHandle400ValidationError_WhenValidationException()
    {
        // Arrange
        var context = CreateHttpContextWithProblemDetailsService();
        var validationException = new ValidationException([
            new("Property1", "Message1")
        ]);

        // Act
        var result = await _handler.TryHandleAsync(context, validationException, CancellationToken.None);

        // Assert
        result.Should().BeTrue();
        await _problemDetailsService.Received(1).WriteAsync(Arg.Is<ProblemDetailsContext>(pdc => 
            pdc.HttpContext == context &&
            pdc.ProblemDetails.Status == StatusCodes.Status400BadRequest &&
            pdc.ProblemDetails.Type == "ValidationFailure" &&
            pdc.ProblemDetails.Title == "Validation error" &&
            pdc.ProblemDetails.Detail == "One or more validation errors has occurred" &&
            pdc.ProblemDetails.Extensions.ContainsKey("errors")));
    }

    [Fact]
    public async Task TryHandleAsync_ShouldReturnTrueAndHandle500InternalServerError_WhenGenericException()
    {
        // Arrange
        var context = CreateHttpContextWithProblemDetailsService();
        var exception = new InvalidOperationException("Something went wrong");

        // Act
        var result = await _handler.TryHandleAsync(context, exception, CancellationToken.None);

        // Assert
        result.Should().BeTrue();
        await _problemDetailsService.Received(1).WriteAsync(Arg.Is<ProblemDetailsContext>(pdc => 
            pdc.HttpContext == context &&
            pdc.ProblemDetails.Status == StatusCodes.Status500InternalServerError &&
            pdc.ProblemDetails.Type == "ServerError" &&
            pdc.ProblemDetails.Title == "Server error" &&
            pdc.ProblemDetails.Detail == "An unexpected error has occurred"));
    }

    [Fact]
    public async Task TryHandleAsync_ShouldLogError_ForAnyException()
    {
        // Arrange
        var context = CreateHttpContextWithProblemDetailsService();
        var exception = new InvalidOperationException("Test exception");

        // Act
        await _handler.TryHandleAsync(context, exception, CancellationToken.None);

        // Assert
        _logger.Received(1).Log(
            LogLevel.Error,
            Arg.Any<EventId>(),
            Arg.Is<object>(v => v.ToString()!.Contains("Exception occurred")),
            exception,
            Arg.Any<Func<object, Exception?, string>>());
    }

    [Fact]
    public async Task TryHandleAsync_ShouldSetCorrectInstance_ForAllExceptions()
    {
        // Arrange
        var context = CreateHttpContextWithProblemDetailsService();
        context.Request.Method = "POST";
        context.Request.Path = "/api/test";
        var exception = new InvalidOperationException("Test exception");

        // Act
        await _handler.TryHandleAsync(context, exception, CancellationToken.None);

        // Assert
        await _problemDetailsService.Received(1).WriteAsync(Arg.Is<ProblemDetailsContext>(pdc => 
            pdc.ProblemDetails.Instance == "POST /api/test"));
    }

    private DefaultHttpContext CreateHttpContextWithProblemDetailsService()
    {
        var services = new ServiceCollection();
        services.AddSingleton(_problemDetailsService);
        var serviceProvider = services.BuildServiceProvider();

        var context = new DefaultHttpContext
        {
            RequestServices = serviceProvider
        };

        return context;
    }
} 
