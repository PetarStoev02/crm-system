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