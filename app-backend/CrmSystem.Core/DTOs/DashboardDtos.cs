namespace CrmSystem.Core.DTOs;

public record DashboardOverviewDto(
    DashboardStatsDto Stats,
    List<RecentCampaignDto> RecentCampaigns,
    List<UpcomingTaskDto> UpcomingTasks,
    List<HighPriorityLeadDto> HighPriorityLeads,
    List<TeamActivityDto> TeamActivity
);

public record DashboardStatsDto(
    int ActiveCampaigns,
    int TotalLeads,
    decimal ConversionRate,
    decimal MonthlyROI
);

public record RecentCampaignDto(
    int Id,
    string Name,
    string Type,
    string Status,
    int DaysLeft,
    DateTime? EndDate
);

public record UpcomingTaskDto(
    int Id,
    string Title,
    DateTime? DueDate,
    string Priority,
    bool IsCompleted,
    string? RelatedEntityName
);

public record HighPriorityLeadDto(
    int Id,
    string FirstName,
    string LastName,
    string Company,
    string Status,
    string Priority,
    DateTime? LastContactedAt
);

public record TeamActivityDto(
    string UserName,
    string Activity,
    DateTime Timestamp,
    string EntityType
); 