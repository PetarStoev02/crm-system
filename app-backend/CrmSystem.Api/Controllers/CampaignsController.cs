using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using CrmSystem.Infrastructure.Data;
using CrmSystem.Core.Entities;
using CrmSystem.Application.DTOs;

namespace CrmSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CampaignsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<CampaignsController> _logger;

    public CampaignsController(AppDbContext context, ILogger<CampaignsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    private string GetCurrentUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
    }

    [HttpGet]
    public async Task<ActionResult<CampaignsResponse>> GetCampaigns(
        [FromQuery] string? search,
        [FromQuery] string? status,
        [FromQuery] string? type,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            var query = _context.Campaigns
                .Include(c => c.CreatedByUser)
                .Where(c => c.CreatedByUserId == currentUserId)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(c => 
                    c.Name.Contains(search) ||
                    c.Description.Contains(search));
            }

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(c => c.Status == status);
            }

            if (!string.IsNullOrEmpty(type))
            {
                query = query.Where(c => c.Type == type);
            }

            var total = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)total / limit);

            var campaigns = await query
                .OrderByDescending(c => c.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(c => new CampaignDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    Type = c.Type,
                    Status = c.Status,
                    StartDate = c.StartDate,
                    EndDate = c.EndDate,
                    Budget = c.Budget,
                    Spent = c.Spent,
                    TargetAudience = c.TargetAudience,
                    Impressions = c.Impressions,
                    Clicks = c.Clicks,
                    Conversions = c.Conversions,
                    CreatedAt = c.CreatedAt,
                    CreatedByUserId = c.CreatedByUserId,
                    CreatedByUser = c.CreatedByUser != null ? new UserDto
                    {
                        FirstName = c.CreatedByUser.FirstName,
                        LastName = c.CreatedByUser.LastName
                    } : null
                })
                .ToListAsync();

            return Ok(new CampaignsResponse
            {
                Campaigns = campaigns,
                Total = total,
                Page = page,
                TotalPages = totalPages
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving campaigns");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CampaignDto>> GetCampaign(int id)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            var campaign = await _context.Campaigns
                .Include(c => c.CreatedByUser)
                .FirstOrDefaultAsync(c => c.Id == id && c.CreatedByUserId == currentUserId);

            if (campaign == null)
            {
                return NotFound();
            }

            return Ok(new CampaignDto
            {
                Id = campaign.Id,
                Name = campaign.Name,
                Description = campaign.Description,
                Type = campaign.Type,
                Status = campaign.Status,
                StartDate = campaign.StartDate,
                EndDate = campaign.EndDate,
                Budget = campaign.Budget,
                Spent = campaign.Spent,
                TargetAudience = campaign.TargetAudience,
                Impressions = campaign.Impressions,
                Clicks = campaign.Clicks,
                Conversions = campaign.Conversions,
                CreatedAt = campaign.CreatedAt,
                CreatedByUserId = campaign.CreatedByUserId,
                CreatedByUser = campaign.CreatedByUser != null ? new UserDto
                {
                    FirstName = campaign.CreatedByUser.FirstName,
                    LastName = campaign.CreatedByUser.LastName
                } : null
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving campaign {CampaignId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    public async Task<ActionResult<CampaignDto>> CreateCampaign([FromBody] CreateCampaignRequest request)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            
            var campaign = new Campaign
            {
                Name = request.Name,
                Description = request.Description,
                Type = request.Type ?? "Email",
                Status = request.Status ?? "Draft",
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Budget = request.Budget,
                TargetAudience = request.TargetAudience,
                CreatedByUserId = currentUserId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Campaigns.Add(campaign);
            await _context.SaveChangesAsync();

            // Load the created campaign with user info
            var createdCampaign = await _context.Campaigns
                .Include(c => c.CreatedByUser)
                .FirstOrDefaultAsync(c => c.Id == campaign.Id);

            var response = new CampaignDto
            {
                Id = createdCampaign!.Id,
                Name = createdCampaign.Name,
                Description = createdCampaign.Description,
                Type = createdCampaign.Type,
                Status = createdCampaign.Status,
                StartDate = createdCampaign.StartDate,
                EndDate = createdCampaign.EndDate,
                Budget = createdCampaign.Budget,
                Spent = createdCampaign.Spent,
                TargetAudience = createdCampaign.TargetAudience,
                Impressions = createdCampaign.Impressions,
                Clicks = createdCampaign.Clicks,
                Conversions = createdCampaign.Conversions,
                CreatedAt = createdCampaign.CreatedAt,
                CreatedByUserId = createdCampaign.CreatedByUserId,
                CreatedByUser = createdCampaign.CreatedByUser != null ? new UserDto
                {
                    FirstName = createdCampaign.CreatedByUser.FirstName,
                    LastName = createdCampaign.CreatedByUser.LastName
                } : null
            };

            return CreatedAtAction(nameof(GetCampaign), new { id = campaign.Id }, response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating campaign");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<CampaignDto>> UpdateCampaign(int id, [FromBody] UpdateCampaignRequest request)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            var campaign = await _context.Campaigns
                .Include(c => c.CreatedByUser)
                .FirstOrDefaultAsync(c => c.Id == id && c.CreatedByUserId == currentUserId);

            if (campaign == null)
            {
                return NotFound();
            }

            // Update only provided fields
            if (request.Name != null) campaign.Name = request.Name;
            if (request.Description != null) campaign.Description = request.Description;
            if (request.Type != null) campaign.Type = request.Type;
            if (request.Status != null) campaign.Status = request.Status;
            if (request.StartDate.HasValue) campaign.StartDate = request.StartDate.Value;
            if (request.EndDate.HasValue) campaign.EndDate = request.EndDate;
            if (request.Budget.HasValue) campaign.Budget = request.Budget.Value;
            if (request.TargetAudience.HasValue) campaign.TargetAudience = request.TargetAudience.Value;
            if (request.Spent.HasValue) campaign.Spent = request.Spent.Value;
            if (request.Impressions.HasValue) campaign.Impressions = request.Impressions.Value;
            if (request.Clicks.HasValue) campaign.Clicks = request.Clicks.Value;
            if (request.Conversions.HasValue) campaign.Conversions = request.Conversions.Value;

            await _context.SaveChangesAsync();

            return Ok(new CampaignDto
            {
                Id = campaign.Id,
                Name = campaign.Name,
                Description = campaign.Description,
                Type = campaign.Type,
                Status = campaign.Status,
                StartDate = campaign.StartDate,
                EndDate = campaign.EndDate,
                Budget = campaign.Budget,
                Spent = campaign.Spent,
                TargetAudience = campaign.TargetAudience,
                Impressions = campaign.Impressions,
                Clicks = campaign.Clicks,
                Conversions = campaign.Conversions,
                CreatedAt = campaign.CreatedAt,
                CreatedByUserId = campaign.CreatedByUserId,
                CreatedByUser = campaign.CreatedByUser != null ? new UserDto
                {
                    FirstName = campaign.CreatedByUser.FirstName,
                    LastName = campaign.CreatedByUser.LastName
                } : null
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating campaign {CampaignId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCampaign(int id)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            var campaign = await _context.Campaigns
                .FirstOrDefaultAsync(c => c.Id == id && c.CreatedByUserId == currentUserId);

            if (campaign == null)
            {
                return NotFound();
            }

            _context.Campaigns.Remove(campaign);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting campaign {CampaignId}", id);
            return StatusCode(500, "Internal server error");
        }
    }
} 