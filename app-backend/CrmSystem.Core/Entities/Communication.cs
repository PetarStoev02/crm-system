namespace CrmSystem.Core.Entities;

public class Communication
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty; // Email, Call, Meeting, SMS
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Direction { get; set; } = string.Empty; // Inbound, Outbound
    public string Status { get; set; } = "Sent"; // Sent, Received, Scheduled, Cancelled
    public string Priority { get; set; } = "Medium"; // Low, Medium, High
    public DateTime CommunicationDate { get; set; } = DateTime.UtcNow;
    public DateTime? FollowUpDate { get; set; }
    public string Notes { get; set; } = string.Empty;
    public bool IsRead { get; set; } = false;
    public string Tags { get; set; } = string.Empty; // Comma-separated tags
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Foreign keys
    public int? ClientId { get; set; }
    public int? LeadId { get; set; }
    public string UserId { get; set; } = string.Empty;
    
    // Navigation properties
    public Client? Client { get; set; }
    public Lead? Lead { get; set; }
    public User? User { get; set; }
    
    // Additional properties for specific communication types
    public string? Duration { get; set; } // For calls and meetings
    public string? Location { get; set; } // For meetings
    public string? Attendees { get; set; } // For meetings
} 