FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY StudioAEC.Api/StudioAEC.Api.csproj StudioAEC.Api/
RUN dotnet restore StudioAEC.Api/StudioAEC.Api.csproj
COPY StudioAEC.Api/ StudioAEC.Api/
RUN dotnet publish StudioAEC.Api/StudioAEC.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

# A imagem aspnet:8.0 já fornece um usuário não-root chamado "app".
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# curl é necessário para o HEALTHCHECK.
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build --chown=app:app /app/publish .
USER app

ENV ASPNETCORE_URLS=http://+:8080 \
    DOTNET_RUNNING_IN_CONTAINER=true \
    DOTNET_NOLOGO=true

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD curl -fsS http://localhost:8080/health || exit 1

ENTRYPOINT ["dotnet", "StudioAEC.Api.dll"]
