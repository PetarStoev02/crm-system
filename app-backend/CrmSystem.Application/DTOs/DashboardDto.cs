namespace CrmSystem.Application.DTOs;

// Lead-specific DTOs
public class LeadDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Company { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public decimal EstimatedValue { get; set; }
    public string Source { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? LastContactedAt { get; set; }
    public string AssignedToUserId { get; set; } = string.Empty;
    public UserDto? AssignedToUser { get; set; }
}

public class UserDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
}

public class CreateLeadRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Company { get; set; }
    public string? Status { get; set; }
    public string? Priority { get; set; }
    public string? Notes { get; set; }
    public decimal? EstimatedValue { get; set; }
    public string? Source { get; set; }
}

public class UpdateLeadRequest
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Company { get; set; }
    public string? Status { get; set; }
    public string? Priority { get; set; }
    public string? Notes { get; set; }
    public decimal? EstimatedValue { get; set; }
    public string? Source { get; set; }
    public string? LastContactedAt { get; set; }
}

public class LeadsResponse
{
    public List<LeadDto> Leads { get; set; } = new();
    public int Total { get; set; }
    public int Page { get; set; }
    public int TotalPages { get; set; }
}

public class LeadStatsDto
{
    public int TotalLeads { get; set; }
    public int QualifiedLeads { get; set; }
    public double ConversionRate { get; set; }
    public int HotLeads { get; set; }
    public int NewLeadsThisWeek { get; set; }
    public double AverageEstimatedValue { get; set; }
}

public class BulkUpdateStatusRequest
{
    public List<int> LeadIds { get; set; } = new();
    public string Status { get; set; } = string.Empty;
}

// Task-specific DTOs
public class TaskDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string AssignedToUserId { get; set; } = string.Empty;
    public UserDto? AssignedToUser { get; set; }
    public int? RelatedLeadId { get; set; }
    public RelatedEntityDto? RelatedLead { get; set; }
    public int? RelatedCampaignId { get; set; }
    public RelatedEntityDto? RelatedCampaign { get; set; }
}

public class RelatedEntityDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // "Lead" or "Campaign"
}

public class CreateTaskRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Status { get; set; }
    public string? Priority { get; set; }
    public DateTime? DueDate { get; set; }
    public int? RelatedLeadId { get; set; }
    public int? RelatedCampaignId { get; set; }
}

public class UpdateTaskRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Status { get; set; }
    public string? Priority { get; set; }
    public DateTime? DueDate { get; set; }
    public int? RelatedLeadId { get; set; }
    public int? RelatedCampaignId { get; set; }
}

public class UpdateTaskStatusRequest
{
    public string Status { get; set; } = string.Empty;
}

public class TasksResponse
{
    public List<TaskDto> Tasks { get; set; } = new();
    public int TotalCount { get; set; }
    public int TotalTasks { get; set; }
    public int Page { get; set; }
    public int Limit { get; set; }
    public int TotalPages { get; set; }
}

// Campaign-specific DTOs
public class CampaignDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public decimal Budget { get; set; }
    public decimal Spent { get; set; }
    public int TargetAudience { get; set; }
    public int Impressions { get; set; }
    public int Clicks { get; set; }
    public int Conversions { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CreatedByUserId { get; set; } = string.Empty;
    public UserDto? CreatedByUser { get; set; }
}

public class CreateCampaignRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Type { get; set; }
    public string? Status { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public decimal Budget { get; set; }
    public int TargetAudience { get; set; }
}

public class UpdateCampaignRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Type { get; set; }
    public string? Status { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public decimal? Budget { get; set; }
    public int? TargetAudience { get; set; }
    public decimal? Spent { get; set; }
    public int? Impressions { get; set; }
    public int? Clicks { get; set; }
    public int? Conversions { get; set; }
}

public class CampaignsResponse
{
    public List<CampaignDto> Campaigns { get; set; } = new();
    public int Total { get; set; }
    public int Page { get; set; }
    public int TotalPages { get; set; }
} 