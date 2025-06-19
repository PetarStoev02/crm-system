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
public class LeadsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<LeadsController> _logger;

    public LeadsController(AppDbContext context, ILogger<LeadsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    private string GetCurrentUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
    }

    [HttpGet]
    public async Task<ActionResult<LeadsResponse>> GetLeads(
        [FromQuery] string? search,
        [FromQuery] string? status,
        [FromQuery] string? priority,
        [FromQuery] string? source,
        [FromQuery] string? assignedTo,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            var query = _context.Leads
                .Include(l => l.AssignedToUser)
                .Where(l => l.AssignedToUserId == currentUserId)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(l => 
                    l.FirstName.Contains(search) ||
                    l.LastName.Contains(search) ||
                    l.Email.Contains(search) ||
                    (l.Company != null && l.Company.Contains(search)));
            }

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(l => l.Status == status);
            }

            if (!string.IsNullOrEmpty(priority))
            {
                query = query.Where(l => l.Priority == priority);
            }

            if (!string.IsNullOrEmpty(source))
            {
                query = query.Where(l => l.Source == source);
            }

            if (!string.IsNullOrEmpty(assignedTo))
            {
                query = query.Where(l => l.AssignedToUserId == assignedTo);
            }

            var total = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)total / limit);

            var leads = await query
                .OrderByDescending(l => l.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(l => new LeadDto
                {
                    Id = l.Id,
                    FirstName = l.FirstName,
                    LastName = l.LastName,
                    Email = l.Email,
                    Phone = l.Phone,
                    Company = l.Company,
                    Status = l.Status,
                    Priority = l.Priority,
                    Notes = l.Notes,
                    EstimatedValue = l.EstimatedValue,
                    Source = l.Source,
                    CreatedAt = l.CreatedAt,
                    LastContactedAt = l.LastContactedAt,
                    AssignedToUserId = l.AssignedToUserId,
                    AssignedToUser = l.AssignedToUser != null ? new UserDto
                    {
                        FirstName = l.AssignedToUser.FirstName,
                        LastName = l.AssignedToUser.LastName
                    } : null
                })
                .ToListAsync();

            return Ok(new LeadsResponse
            {
                Leads = leads,
                Total = total,
                Page = page,
                TotalPages = totalPages
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving leads");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<LeadDto>> GetLead(int id)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            var lead = await _context.Leads
                .Include(l => l.AssignedToUser)
                .FirstOrDefaultAsync(l => l.Id == id && l.AssignedToUserId == currentUserId);

            if (lead == null)
            {
                return NotFound();
            }

            return Ok(new LeadDto
            {
                Id = lead.Id,
                FirstName = lead.FirstName,
                LastName = lead.LastName,
                Email = lead.Email,
                Phone = lead.Phone,
                Company = lead.Company,
                Status = lead.Status,
                Priority = lead.Priority,
                Notes = lead.Notes,
                EstimatedValue = lead.EstimatedValue,
                Source = lead.Source,
                CreatedAt = lead.CreatedAt,
                LastContactedAt = lead.LastContactedAt,
                AssignedToUserId = lead.AssignedToUserId,
                AssignedToUser = lead.AssignedToUser != null ? new UserDto
                {
                    FirstName = lead.AssignedToUser.FirstName,
                    LastName = lead.AssignedToUser.LastName
                } : null
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving lead {LeadId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    public async Task<ActionResult<LeadDto>> CreateLead([FromBody] CreateLeadRequest request)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            
            var lead = new Lead
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Phone = request.Phone,
                Company = request.Company,
                Status = request.Status ?? "New",
                Priority = request.Priority ?? "Medium",
                Notes = request.Notes,
                EstimatedValue = request.EstimatedValue ?? 0,
                Source = request.Source ?? "Website",
                AssignedToUserId = currentUserId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Leads.Add(lead);
            await _context.SaveChangesAsync();

            // Load the created lead with user info
            var createdLead = await _context.Leads
                .Include(l => l.AssignedToUser)
                .FirstOrDefaultAsync(l => l.Id == lead.Id);

            var response = new LeadDto
            {
                Id = createdLead!.Id,
                FirstName = createdLead.FirstName,
                LastName = createdLead.LastName,
                Email = createdLead.Email,
                Phone = createdLead.Phone,
                Company = createdLead.Company,
                Status = createdLead.Status,
                Priority = createdLead.Priority,
                Notes = createdLead.Notes,
                EstimatedValue = createdLead.EstimatedValue,
                Source = createdLead.Source,
                CreatedAt = createdLead.CreatedAt,
                LastContactedAt = createdLead.LastContactedAt,
                AssignedToUserId = createdLead.AssignedToUserId,
                AssignedToUser = createdLead.AssignedToUser != null ? new UserDto
                {
                    FirstName = createdLead.AssignedToUser.FirstName,
                    LastName = createdLead.AssignedToUser.LastName
                } : null
            };

            return CreatedAtAction(nameof(GetLead), new { id = lead.Id }, response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating lead");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<LeadDto>> UpdateLead(int id, [FromBody] UpdateLeadRequest request)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            var lead = await _context.Leads
                .FirstOrDefaultAsync(l => l.Id == id && l.AssignedToUserId == currentUserId);

            if (lead == null)
            {
                return NotFound();
            }

            // Update fields if provided
            if (!string.IsNullOrEmpty(request.FirstName))
                lead.FirstName = request.FirstName;
            
            if (!string.IsNullOrEmpty(request.LastName))
                lead.LastName = request.LastName;
            
            if (!string.IsNullOrEmpty(request.Email))
                lead.Email = request.Email;
            
            if (request.Phone != null)
                lead.Phone = request.Phone;
            
            if (request.Company != null)
                lead.Company = request.Company;
            
            if (!string.IsNullOrEmpty(request.Status))
                lead.Status = request.Status;
            
            if (!string.IsNullOrEmpty(request.Priority))
                lead.Priority = request.Priority;
            
            if (request.Notes != null)
                lead.Notes = request.Notes;
            
            if (request.EstimatedValue.HasValue)
                lead.EstimatedValue = request.EstimatedValue.Value;
            
            if (!string.IsNullOrEmpty(request.Source))
                lead.Source = request.Source;

            if (!string.IsNullOrEmpty(request.LastContactedAt))
            {
                if (DateTime.TryParse(request.LastContactedAt, out var contactDate))
                {
                    lead.LastContactedAt = contactDate;
                }
            }

            await _context.SaveChangesAsync();

            // Return updated lead with user info
            var updatedLead = await _context.Leads
                .Include(l => l.AssignedToUser)
                .FirstOrDefaultAsync(l => l.Id == id);

            return Ok(new LeadDto
            {
                Id = updatedLead!.Id,
                FirstName = updatedLead.FirstName,
                LastName = updatedLead.LastName,
                Email = updatedLead.Email,
                Phone = updatedLead.Phone,
                Company = updatedLead.Company,
                Status = updatedLead.Status,
                Priority = updatedLead.Priority,
                Notes = updatedLead.Notes,
                EstimatedValue = updatedLead.EstimatedValue,
                Source = updatedLead.Source,
                CreatedAt = updatedLead.CreatedAt,
                LastContactedAt = updatedLead.LastContactedAt,
                AssignedToUserId = updatedLead.AssignedToUserId,
                AssignedToUser = updatedLead.AssignedToUser != null ? new UserDto
                {
                    FirstName = updatedLead.AssignedToUser.FirstName,
                    LastName = updatedLead.AssignedToUser.LastName
                } : null
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating lead {LeadId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteLead(int id)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            var lead = await _context.Leads
                .FirstOrDefaultAsync(l => l.Id == id && l.AssignedToUserId == currentUserId);

            if (lead == null)
            {
                return NotFound();
            }

            _context.Leads.Remove(lead);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting lead {LeadId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("stats")]
    public async Task<ActionResult<LeadStatsDto>> GetLeadStats()
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            var leads = await _context.Leads
                .Where(l => l.AssignedToUserId == currentUserId)
                .ToListAsync();

            var totalLeads = leads.Count;
            var qualifiedLeads = leads.Count(l => l.Status == "Qualified");
            var hotLeads = leads.Count(l => l.Priority == "High" && 
                (l.Status == "New" || l.Status == "Contacted" || l.Status == "Qualified"));
            
            var wonLeads = leads.Count(l => l.Status == "Closed-Won");
            var conversionRate = totalLeads > 0 ? (double)wonLeads / totalLeads * 100 : 0;

            var weekAgo = DateTime.UtcNow.AddDays(-7);
            var newLeadsThisWeek = leads.Count(l => l.CreatedAt >= weekAgo);

            var averageEstimatedValue = leads.Count > 0 ? (double)leads.Average(l => l.EstimatedValue) : 0;

            return Ok(new LeadStatsDto
            {
                TotalLeads = totalLeads,
                QualifiedLeads = qualifiedLeads,
                ConversionRate = conversionRate,
                HotLeads = hotLeads,
                NewLeadsThisWeek = newLeadsThisWeek,
                AverageEstimatedValue = averageEstimatedValue
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving lead stats");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("{id}/contact")]
    public async Task<ActionResult<LeadDto>> MarkAsContacted(int id)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            var lead = await _context.Leads
                .Include(l => l.AssignedToUser)
                .FirstOrDefaultAsync(l => l.Id == id && l.AssignedToUserId == currentUserId);

            if (lead == null)
            {
                return NotFound();
            }

            lead.LastContactedAt = DateTime.UtcNow;
            if (lead.Status == "New")
            {
                lead.Status = "Contacted";
            }

            await _context.SaveChangesAsync();

            return Ok(new LeadDto
            {
                Id = lead.Id,
                FirstName = lead.FirstName,
                LastName = lead.LastName,
                Email = lead.Email,
                Phone = lead.Phone,
                Company = lead.Company,
                Status = lead.Status,
                Priority = lead.Priority,
                Notes = lead.Notes,
                EstimatedValue = lead.EstimatedValue,
                Source = lead.Source,
                CreatedAt = lead.CreatedAt,
                LastContactedAt = lead.LastContactedAt,
                AssignedToUserId = lead.AssignedToUserId,
                AssignedToUser = lead.AssignedToUser != null ? new UserDto
                {
                    FirstName = lead.AssignedToUser.FirstName,
                    LastName = lead.AssignedToUser.LastName
                } : null
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking lead {LeadId} as contacted", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("bulk-update-status")]
    public async Task<ActionResult> BulkUpdateStatus([FromBody] BulkUpdateStatusRequest request)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            var leads = await _context.Leads
                .Where(l => request.LeadIds.Contains(l.Id) && l.AssignedToUserId == currentUserId)
                .ToListAsync();

            foreach (var lead in leads)
            {
                lead.Status = request.Status;
            }

            await _context.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error bulk updating lead status");
            return StatusCode(500, "Internal server error");
        }
    }
} 