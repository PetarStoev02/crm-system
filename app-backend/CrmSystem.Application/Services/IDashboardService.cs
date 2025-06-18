using CrmSystem.Core.DTOs;

namespace CrmSystem.Application.Services;

public interface IDashboardService
{
    Task<DashboardStatsDto> GetDashboardStatsAsync(string userId);
    Task<DashboardOverviewDto> GetDashboardOverviewAsync(string userId);
} 