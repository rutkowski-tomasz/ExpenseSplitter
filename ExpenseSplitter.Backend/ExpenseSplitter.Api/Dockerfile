FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
WORKDIR /app

# Copy everything else and build
COPY ["ExpenseSplitter.Api/*.csproj", "ExpenseSplitter.Api/"]
COPY ["ExpenseSplitter.Tests/*.csproj", "ExpenseSplitter.Tests/"]

RUN dotnet restore "ExpenseSplitter.Tests/ExpenseSplitter.Tests.csproj"

# Copy other files
COPY ./ExpenseSplitter.Api ./ExpenseSplitter.Api/
COPY ./ExpenseSplitter.Tests ./ExpenseSplitter.Tests/

# Run unit tests
RUN dotnet test "ExpenseSplitter.Tests/ExpenseSplitter.Tests.csproj"

WORKDIR "/app/ExpenseSplitter.Api"
RUN dotnet publish "ExpenseSplitter.Api.csproj" -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-alpine
WORKDIR /app
COPY --from=build-env /app/ExpenseSplitter.Api/out .
ENV ASPNETCORE_URLS http://+:7001
ENTRYPOINT ["dotnet", "ExpenseSplitter.Api.dll"]
