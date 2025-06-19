namespace CrmSystem.Core.Entities;

public class Client
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Status { get; set; } = "Active"; // Active, Inactive, Prospect
    public string Type { get; set; } = "Individual"; // Individual, Business
    public decimal TotalValue { get; set; } = 0; // Total value of all invoices
    public decimal OutstandingBalance { get; set; } = 0; // Amount still owed
    public string Notes { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastInvoiceDate { get; set; }
    public string AssignedToUserId { get; set; } = string.Empty;
    public User? AssignedToUser { get; set; }
    
    // Navigation properties
    public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
} 