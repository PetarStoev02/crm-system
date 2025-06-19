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

        // Calculate monthly ROI
        var currentMonth = DateTime.Today.Month;
        var currentYear = DateTime.Today.Year;

        var monthlyCampaigns = await _context.Campaigns
            .Where(c => c.CreatedByUserId == userId && 
                       c.StartDate.Month == currentMonth && 
                       c.StartDate.Year == currentYear)
            .ToListAsync();

        var monthlyBudget = monthlyCampaigns.Sum(c => c.Budget);
        var monthlySpent = monthlyCampaigns.Sum(c => c.Spent);
        var monthlyROI = monthlyBudget > 0 ? (monthlySpent - monthlyBudget) / monthlyBudget * 100 : 0m;

        return new DashboardStatsDto(activeCampaigns, totalLeads, conversionRate, monthlyROI);
    }

    public override async Task<DashboardOverviewDto> GetDashboardOverviewAsync(string userId)
    {
        // Get stats
        var stats = await GetDashboardStatsAsync(userId);

        // Get recent campaigns
        var recentCampaigns = await GetRecentCampaignsAsync(userId);

        // Get upcoming tasks
        var upcomingTasks = await GetUpcomingTasksAsync(userId);

        // Get high priority leads
        var highPriorityLeads = await GetHighPriorityLeadsAsync(userId);

        // Get team activity
        var teamActivity = await GetTeamActivityAsync(userId);

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
        var tasks = await _context.Tasks
            .Where(t => t.AssignedToUserId == userId && 
                       t.DueDate >= DateTime.Today && 
                       t.Status != "Completed")
            .OrderBy(t => t.DueDate)
            .Take(5)
            .ToListAsync();

        var taskDtos = new List<UpcomingTaskDto>();

        foreach (var task in tasks)
        {
            string? relatedEntityName = null;
            
            if (task.RelatedLeadId.HasValue)
            {
                var lead = await _context.Leads.FindAsync(task.RelatedLeadId.Value);
                if (lead != null)
                {
                    relatedEntityName = $"{lead.FirstName} {lead.LastName}";
                }
            }
            else if (task.RelatedCampaignId.HasValue)
            {
                var campaign = await _context.Campaigns.FindAsync(task.RelatedCampaignId.Value);
                if (campaign != null)
                {
                    relatedEntityName = campaign.Name;
                }
            }

            taskDtos.Add(new UpcomingTaskDto(
                task.Id,
                task.Title,
                task.DueDate,
                task.Priority,
                task.Status == "Completed",
                relatedEntityName));
        }

        return taskDtos;
    }

    private async Task<List<HighPriorityLeadDto>> GetHighPriorityLeadsAsync(string userId)
    {
        return await _context.Leads
            .Where(l => l.AssignedToUserId == userId && 
                       l.Priority == "High" && 
                       (l.Status == "New" || l.Status == "Contacted" || l.Status == "Qualified"))
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

    private async Task<List<TeamActivityDto>> GetTeamActivityAsync(string userId)
    {
        var activities = new List<TeamActivityDto>();

        // Get recent leads created
        var recentLeads = await _context.Leads
            .Where(l => l.AssignedToUserId == userId && l.CreatedAt >= DateTime.Today.AddDays(-7))
            .OrderByDescending(l => l.CreatedAt)
            .Take(3)
            .ToListAsync();

        foreach (var lead in recentLeads)
        {
            var user = await _context.Users.FindAsync(lead.AssignedToUserId);
            var userName = user != null ? $"{user.FirstName} {user.LastName}" : "Unknown User";
            
            activities.Add(new TeamActivityDto(
                userName,
                $"Created lead: {lead.FirstName} {lead.LastName}",
                lead.CreatedAt,
                "Lead"));
        }

        // Get recent campaigns
        var recentCampaigns = await _context.Campaigns
            .Where(c => c.CreatedByUserId == userId && c.CreatedAt >= DateTime.Today.AddDays(-7))
            .OrderByDescending(c => c.CreatedAt)
            .Take(2)
            .ToListAsync();

        foreach (var campaign in recentCampaigns)
        {
            var user = await _context.Users.FindAsync(campaign.CreatedByUserId);
            var userName = user != null ? $"{user.FirstName} {user.LastName}" : "Unknown User";
            
            activities.Add(new TeamActivityDto(
                userName,
                $"Created campaign: {campaign.Name}",
                campaign.CreatedAt,
                "Campaign"));
        }

        // Get recent completed tasks
        var recentTasks = await _context.Tasks
            .Where(t => t.AssignedToUserId == userId && 
                       t.CompletedAt >= DateTime.Today.AddDays(-7) &&
                       t.Status == "Completed")
            .OrderByDescending(t => t.CompletedAt)
            .Take(2)
            .ToListAsync();

        foreach (var task in recentTasks)
        {
            var user = await _context.Users.FindAsync(task.AssignedToUserId);
            var userName = user != null ? $"{user.FirstName} {user.LastName}" : "Unknown User";
            
            activities.Add(new TeamActivityDto(
                userName,
                $"Completed task: {task.Title}",
                task.CompletedAt ?? DateTime.Now,
                "Task"));
        }

        return activities.OrderByDescending(a => a.Timestamp).Take(10).ToList();
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