FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy the solution file first
COPY ["app-backend/CrmSystem.sln", "app-backend/"]
COPY ["app-backend/CrmSystem.Api/CrmSystem.Api.csproj", "app-backend/CrmSystem.Api/"]
COPY ["app-backend/CrmSystem.Core/CrmSystem.Core.csproj", "app-backend/CrmSystem.Core/"]
COPY ["app-backend/CrmSystem.Application/CrmSystem.Application.csproj", "app-backend/CrmSystem.Application/"]
COPY ["app-backend/CrmSystem.Infrastructure/CrmSystem.Infrastructure.csproj", "app-backend/CrmSystem.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "app-backend/CrmSystem.Api/CrmSystem.Api.csproj"

# Copy the rest of the source code
COPY app-backend/ .

# Build the application
WORKDIR "/src/app-backend/CrmSystem.Api"
RUN dotnet build "CrmSystem.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CrmSystem.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CrmSystem.Api.dll"] 