namespace CrmSystem.Core.Entities;

public class Lead
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Company { get; set; }
    public string Status { get; set; } = "New"; // New, Contacted, Qualified, Proposal, Closed-Won, Closed-Lost
    public string Priority { get; set; } = "Medium"; // Low, Medium, High
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastContactedAt { get; set; }
    public string AssignedToUserId { get; set; } = string.Empty;
    public User? AssignedToUser { get; set; }
    public decimal EstimatedValue { get; set; }
    public string Source { get; set; } = "Website"; // Website, Social Media, Referral, Cold Call, etc.
} 