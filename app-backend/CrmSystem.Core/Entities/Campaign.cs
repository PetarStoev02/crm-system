namespace CrmSystem.Core.Entities;

public class Campaign
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = "Email"; // Email, Social Media, Display Ads, Content Marketing, etc.
    public string Status { get; set; } = "Draft"; // Draft, Active, Paused, Completed, Cancelled
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public decimal Budget { get; set; }
    public decimal Spent { get; set; }
    public int TargetAudience { get; set; }
    public int Impressions { get; set; }
    public int Clicks { get; set; }
    public int Conversions { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string CreatedByUserId { get; set; } = string.Empty;
    public User? CreatedByUser { get; set; }
} 