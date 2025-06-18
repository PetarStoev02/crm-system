namespace CrmSystem.Core.Entities;

public class Task
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending"; // Pending, In Progress, Completed, Cancelled
    public string Priority { get; set; } = "Medium"; // Low, Medium, High, Critical
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
    public string AssignedToUserId { get; set; } = string.Empty;
    public User? AssignedToUser { get; set; }
    public string CreatedByUserId { get; set; } = string.Empty;
    public User? CreatedByUser { get; set; }
    public int? RelatedLeadId { get; set; }
    public Lead? RelatedLead { get; set; }
    public int? RelatedCampaignId { get; set; }
    public Campaign? RelatedCampaign { get; set; }
} 