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

    public override async Task<DashboardStatsDto> GetDashboardStatsAsync(string userId)
    {
        // Temporarily return hard-coded values to test
        return new DashboardStatsDto(0, 0, 0m, 0m);
    }

    public override async Task<DashboardOverviewDto> GetDashboardOverviewAsync(string userId)
    {
        // Return completely static data to test if the API works at all
        var stats = new DashboardStatsDto(0, 0, 0.0m, 0.0m);
        var recentCampaigns = new List<RecentCampaignDto>();
        var upcomingTasks = new List<UpcomingTaskDto>();
        var highPriorityLeads = new List<HighPriorityLeadDto>();
        var teamActivity = new List<TeamActivityDto>();

        return new DashboardOverviewDto(
            stats,
            recentCampaigns,
            upcomingTasks,
            highPriorityLeads,
            teamActivity
        );
    }

    private async Task<List<RecentCampaignDto>> GetRecentCampaignsAsync(string userId)
    {
        var campaigns = await _context.Campaigns
            .Where(c => c.CreatedByUserId == userId)
            .OrderByDescending(c => c.CreatedAt)
            .Take(5)
            .ToListAsync();

        return campaigns.Select(c => new RecentCampaignDto(
            c.Id,
            c.Name,
            c.Type,
            c.Status,
            c.EndDate.HasValue ? (int)(c.EndDate.Value - DateTime.UtcNow).TotalDays : 0,
            c.EndDate))
            .ToList();
    }

    private async Task<List<UpcomingTaskDto>> GetUpcomingTasksAsync(string userId)
    {
        return await _context.Tasks
            .Include(t => t.RelatedLead)
            .Include(t => t.RelatedCampaign)
            .Where(t => t.AssignedToUserId == userId && t.DueDate >= DateTime.Today)
            .OrderBy(t => t.DueDate)
            .Take(5)
            .Select(t => new UpcomingTaskDto(
                t.Id,
                t.Title,
                t.DueDate,
                t.Priority,
                t.Status == "Completed",
                t.RelatedLead != null ? $"{t.RelatedLead.FirstName} {t.RelatedLead.LastName}" :
                t.RelatedCampaign != null ? t.RelatedCampaign.Name : null))
            .ToListAsync();
    }

    private async Task<List<HighPriorityLeadDto>> GetHighPriorityLeadsAsync(string userId)
    {
        return await _context.Leads
            .Where(l => l.AssignedToUserId == userId && l.Priority == "High")
            .OrderByDescending(l => l.CreatedAt)
            .Take(5)
            .Select(l => new HighPriorityLeadDto(
                l.Id,
                l.FirstName,
                l.LastName,
                l.Company ?? "No Company",
                l.Status,
                l.Priority,
                l.LastContactedAt))
            .ToListAsync();
    }

    private async Task<List<TeamActivityDto>> GetTeamActivityAsync()
    {
        var recentTasks = await _context.Tasks
            .Include(t => t.AssignedToUser)
            .Where(t => t.CompletedAt >= DateTime.Today.AddDays(-7))
            .OrderByDescending(t => t.CompletedAt)
            .Take(10)
            .Select(t => new TeamActivityDto(
                $"{t.AssignedToUser!.FirstName} {t.AssignedToUser.LastName}",
                $"Completed: {t.Title}",
                t.CompletedAt ?? DateTime.Now,
                "Task"))
            .ToListAsync();

        var recentCampaigns = await _context.Campaigns
            .Include(c => c.CreatedByUser)
            .Where(c => c.CreatedAt >= DateTime.Today.AddDays(-7))
            .OrderByDescending(c => c.CreatedAt)
            .Take(5)
            .Select(c => new TeamActivityDto(
                $"{c.CreatedByUser!.FirstName} {c.CreatedByUser.LastName}",
                $"Created: {c.Name}",
                c.CreatedAt,
                "Campaign"))
            .ToListAsync();

        return recentTasks.Concat(recentCampaigns)
            .OrderByDescending(a => a.Timestamp)
            .Take(10)
            .ToList();
    }

    private async Task<decimal> CalculateConversionRateAsync(string userId)
    {
        var totalLeads = await _context.Leads
            .Where(l => l.AssignedToUserId == userId)
            .CountAsync();

        if (totalLeads == 0) return 0;

        var convertedLeads = await _context.Leads
            .Where(l => l.AssignedToUserId == userId && l.Status == "Closed-Won")
            .CountAsync();

        return Math.Round((decimal)convertedLeads / totalLeads * 100, 1);
    }

    private async Task<decimal> CalculateMonthlyROIAsync()
    {
        var currentMonth = DateTime.Today.Month;
        var currentYear = DateTime.Today.Year;

        var campaigns = await _context.Campaigns
            .Where(c => c.StartDate.Month == currentMonth && c.StartDate.Year == currentYear)
            .ToListAsync();
        
        var monthlyBudget = campaigns.Sum(c => c.Budget);

        if (monthlyBudget == 0) return 0;

        var leads = await _context.Leads
            .Where(l => l.CreatedAt.Month == currentMonth && 
                       l.CreatedAt.Year == currentYear && 
                       l.Status == "Closed-Won")
            .ToListAsync();
            
        var monthlyRevenue = leads.Sum(l => l.EstimatedValue);

        var roi = ((monthlyRevenue - monthlyBudget) / monthlyBudget) * 100;
        return Math.Round(roi, 1);
    }
} 