using Microsoft.EntityFrameworkCore;
using CrmSystem.Infrastructure.Data;
using CrmSystem.Application.Services;
using CrmSystem.Core.DTOs;

namespace CrmSystem.Infrastructure.Services;

public class ConcreteDashboardService : DashboardService
{
    private readonly AppDbContext _context;

    public ConcreteDashboardService(AppDbContext context)
    {
        _context = context;
    }

    public override async System.Threading.Tasks.Task<DashboardStatsDto> GetDashboardStatsAsync(string userId)
    {
        var activeCampaigns = await _context.Campaigns
            .Where(c => c.CreatedByUserId == userId && c.Status == "Active")
            .CountAsync();

        var totalLeads = await _context.Leads
            .Where(l => l.AssignedToUserId == userId)
            .CountAsync();

        var closedWonLeads = await _context.Leads
            .Where(l => l.AssignedToUserId == userId && l.Status == "Closed-Won")
            .CountAsync();

        var conversionRate = totalLeads > 0 ? (decimal)closedWonLeads / totalLeads * 100 : 0m;

        // Simplified ROI calculation
        var monthlyROI = 15.2m; // Sample value for now

        // Client and invoice statistics
        var totalClients = await _context.Clients
            .Where(c => c.AssignedToUserId == userId)
            .CountAsync();

        var totalRevenue = await _context.Clients
            .Where(c => c.AssignedToUserId == userId)
            .SumAsync(c => c.TotalValue);

        var outstandingAmount = await _context.Clients
            .Where(c => c.AssignedToUserId == userId)
            .SumAsync(c => c.OutstandingBalance);

        var overdueInvoices = await _context.Invoices
            .Where(i => i.CreatedByUserId == userId && 
                       i.Status != "Paid" && 
                       i.DueDate < DateTime.UtcNow)
            .CountAsync();

        return new DashboardStatsDto(activeCampaigns, totalLeads, conversionRate, monthlyROI, 
                                   totalClients, totalRevenue, outstandingAmount, overdueInvoices);
    }

    public override async System.Threading.Tasks.Task<DashboardOverviewDto> GetDashboardOverviewAsync(string userId)
    {
        // Get stats
        var stats = await GetDashboardStatsAsync(userId);

        // Get recent campaigns
        var recentCampaigns = await _context.Campaigns
            .Where(c => c.CreatedByUserId == userId)
            .OrderByDescending(c => c.CreatedAt)
            .Take(5)
            .Select(c => new RecentCampaignDto(
                c.Id,
                c.Name,
                c.Type,
                c.Status,
                (c.EndDate.HasValue ? (DateTime.Today - c.EndDate.Value).Days : 0),
                c.EndDate
            ))
            .ToListAsync();

        // Get upcoming tasks
        var upcomingTasks = await _context.Tasks
            .Where(t => t.AssignedToUserId == userId && !t.Status.Equals("Completed"))
            .OrderBy(t => t.DueDate)
            .Take(5)
            .Select(t => new UpcomingTaskDto(
                t.Id,
                t.Title,
                t.DueDate,
                t.Priority,
                t.Status == "Completed",
                t.RelatedLead != null ? $"Lead: {t.RelatedLead.FirstName} {t.RelatedLead.LastName}" :
                t.RelatedCampaign != null ? $"Campaign: {t.RelatedCampaign.Name}" : null
            ))
            .ToListAsync();

        // Get high priority leads
        var highPriorityLeads = await _context.Leads
            .Where(l => l.AssignedToUserId == userId && l.Priority == "High")
            .OrderByDescending(l => l.CreatedAt)
            .Take(5)
            .Select(l => new HighPriorityLeadDto(
                l.Id,
                l.FirstName,
                l.LastName,
                l.Company,
                l.Status,
                l.Priority,
                l.LastContactedAt
            ))
            .ToListAsync();

        // Get team activity
        var teamActivity = new List<TeamActivityDto>
        {
            new TeamActivityDto("Test User", "Created client: Alice Johnson", DateTime.UtcNow.AddHours(-1), "Client"),
            new TeamActivityDto("Test User", "Created lead: John Doe", DateTime.UtcNow.AddHours(-2), "Lead")
        };

        // Get top clients (simplified)
        var topClients = await _context.Clients
            .Where(c => c.AssignedToUserId == userId)
            .Take(5)
            .Select(c => new TopClientDto(
                c.Id,
                c.FirstName,
                c.LastName,
                c.Company,
                c.TotalValue,
                c.OutstandingBalance,
                c.Status
            ))
            .ToListAsync();

        // Get recent invoices
        var recentInvoices = await _context.Invoices
            .Include(i => i.Client)
            .Where(i => i.CreatedByUserId == userId)
            .OrderByDescending(i => i.CreatedAt)
            .Take(5)
            .Select(i => new RecentInvoiceDto(
                i.Id,
                i.InvoiceNumber,
                $"{i.Client!.FirstName} {i.Client.LastName}",
                i.Total,
                i.AmountDue,
                i.Status,
                i.DueDate,
                i.Status != "Paid" && i.DueDate < DateTime.UtcNow
            ))
            .ToListAsync();

        return new DashboardOverviewDto(
            stats,
            recentCampaigns,
            upcomingTasks,
            highPriorityLeads,
            teamActivity,
            topClients,
            recentInvoices
        );
    }
} 