namespace CrmSystem.Core.Entities;

public class Invoice
{
    public int Id { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public int ClientId { get; set; }
    public Client? Client { get; set; }
    public DateTime IssueDate { get; set; } = DateTime.UtcNow;
    public DateTime DueDate { get; set; }
    public string Status { get; set; } = "Draft"; // Draft, Sent, Paid, Overdue, Cancelled
    public decimal SubTotal { get; set; } = 0;
    public decimal TaxRate { get; set; } = 0; // Percentage
    public decimal TaxAmount { get; set; } = 0;
    public decimal Total { get; set; } = 0;
    public decimal AmountPaid { get; set; } = 0;
    public decimal AmountDue { get; set; } = 0;
    public string Currency { get; set; } = "USD";
    public string Notes { get; set; } = string.Empty;
    public string Terms { get; set; } = string.Empty;
    public DateTime? PaidDate { get; set; }
    public string PaymentMethod { get; set; } = string.Empty; // Credit Card, Bank Transfer, Check, Cash
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string CreatedByUserId { get; set; } = string.Empty;
    public User? CreatedByUser { get; set; }
    
    // Navigation properties
    public ICollection<InvoiceItem> Items { get; set; } = new List<InvoiceItem>();
} 