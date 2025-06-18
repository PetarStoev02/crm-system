using CrmSystem.Core.DTOs;

namespace CrmSystem.Application.Services;

public abstract class DashboardService : IDashboardService
{
    public abstract Task<DashboardStatsDto> GetDashboardStatsAsync(string userId);
    public abstract Task<DashboardOverviewDto> GetDashboardOverviewAsync(string userId);
} 