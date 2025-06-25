using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using CrmSystem.Infrastructure.Data;
using CrmSystem.Core.Entities;
using CrmSystem.Core.DTOs;

namespace CrmSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CommunicationsController : ControllerBase
{
    private readonly AppDbContext _context;

    public CommunicationsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetCommunications(
        [FromQuery] string? search = null,
        [FromQuery] string? type = null,
        [FromQuery] string? status = null,
        [FromQuery] string? priority = null,
        [FromQuery] bool? unreadOnly = null,
        [FromQuery] int? clientId = null,
        [FromQuery] int? leadId = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            var query = _context.Communications
                .Include(c => c.Client)
                .Include(c => c.Lead)
                .Include(c => c.User)
                .Where(c => c.UserId == currentUserId);

            // Apply filters
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(c => 
                    c.Subject.Contains(search) ||
                    c.Content.Contains(search) ||
                    (c.Client != null && (c.Client.FirstName.Contains(search) || c.Client.LastName.Contains(search))) ||
                    (c.Lead != null && (c.Lead.FirstName.Contains(search) || c.Lead.LastName.Contains(search))));
            }

            if (!string.IsNullOrEmpty(type))
            {
                query = query.Where(c => c.Type == type);
            }

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(c => c.Status == status);
            }

            if (!string.IsNullOrEmpty(priority))
            {
                query = query.Where(c => c.Priority == priority);
            }

            if (unreadOnly == true)
            {
                query = query.Where(c => !c.IsRead);
            }

            if (clientId.HasValue)
            {
                query = query.Where(c => c.ClientId == clientId);
            }

            if (leadId.HasValue)
            {
                query = query.Where(c => c.LeadId == leadId);
            }

            var totalCount = await query.CountAsync();
            var communications = await query
                .OrderByDescending(c => c.CommunicationDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new CommunicationDto(
                    c.Id,
                    c.Type,
                    c.Subject,
                    c.Content,
                    c.Direction,
                    c.Status,
                    c.Priority,
                    c.CommunicationDate,
                    c.FollowUpDate,
                    c.Notes,
                    c.IsRead,
                    c.Tags,
                    c.CreatedAt,
                    c.UpdatedAt,
                    c.ClientId,
                    c.Client != null ? $"{c.Client.FirstName} {c.Client.LastName}" : null,
                    c.LeadId,
                    c.Lead != null ? $"{c.Lead.FirstName} {c.Lead.LastName}" : null,
                    c.UserId,
                    $"{c.User!.FirstName} {c.User.LastName}",
                    c.Duration,
                    c.Location,
                    c.Attendees
                ))
                .ToListAsync();

            var response = new CommunicationsResponse(
                communications,
                totalCount,
                page,
                pageSize,
                page * pageSize < totalCount,
                page > 1
            );

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching communications", error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCommunication(int id)
    {
        try
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            var communication = await _context.Communications
                .Include(c => c.Client)
                .Include(c => c.Lead)
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == currentUserId);

            if (communication == null)
                return NotFound();

            var communicationDto = new CommunicationDto(
                communication.Id,
                communication.Type,
                communication.Subject,
                communication.Content,
                communication.Direction,
                communication.Status,
                communication.Priority,
                communication.CommunicationDate,
                communication.FollowUpDate,
                communication.Notes,
                communication.IsRead,
                communication.Tags,
                communication.CreatedAt,
                communication.UpdatedAt,
                communication.ClientId,
                communication.Client != null ? $"{communication.Client.FirstName} {communication.Client.LastName}" : null,
                communication.LeadId,
                communication.Lead != null ? $"{communication.Lead.FirstName} {communication.Lead.LastName}" : null,
                communication.UserId,
                $"{communication.User!.FirstName} {communication.User.LastName}",
                communication.Duration,
                communication.Location,
                communication.Attendees
            );

            return Ok(communicationDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching the communication", error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateCommunication([FromBody] CreateCommunicationRequest request)
    {
        try
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            var communication = new Communication
            {
                Type = request.Type,
                Subject = request.Subject,
                Content = request.Content,
                Direction = request.Direction,
                Status = request.Status,
                Priority = request.Priority,
                CommunicationDate = request.CommunicationDate,
                FollowUpDate = request.FollowUpDate,
                Notes = request.Notes,
                Tags = request.Tags,
                ClientId = request.ClientId,
                LeadId = request.LeadId,
                UserId = currentUserId,
                Duration = request.Duration,
                Location = request.Location,
                Attendees = request.Attendees,
                CreatedAt = DateTime.UtcNow
            };

            _context.Communications.Add(communication);
            await _context.SaveChangesAsync();

            var communicationDto = await _context.Communications
                .Include(c => c.Client)
                .Include(c => c.Lead)
                .Include(c => c.User)
                .Where(c => c.Id == communication.Id)
                .Select(c => new CommunicationDto(
                    c.Id,
                    c.Type,
                    c.Subject,
                    c.Content,
                    c.Direction,
                    c.Status,
                    c.Priority,
                    c.CommunicationDate,
                    c.FollowUpDate,
                    c.Notes,
                    c.IsRead,
                    c.Tags,
                    c.CreatedAt,
                    c.UpdatedAt,
                    c.ClientId,
                    c.Client != null ? $"{c.Client.FirstName} {c.Client.LastName}" : null,
                    c.LeadId,
                    c.Lead != null ? $"{c.Lead.FirstName} {c.Lead.LastName}" : null,
                    c.UserId,
                    $"{c.User!.FirstName} {c.User.LastName}",
                    c.Duration,
                    c.Location,
                    c.Attendees
                ))
                .FirstAsync();

            return Created($"/api/communications/{communication.Id}", communicationDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while creating the communication", error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCommunication(int id, [FromBody] UpdateCommunicationRequest request)
    {
        try
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            var communication = await _context.Communications
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == currentUserId);

            if (communication == null)
                return NotFound();

            communication.Type = request.Type;
            communication.Subject = request.Subject;
            communication.Content = request.Content;
            communication.Direction = request.Direction;
            communication.Status = request.Status;
            communication.Priority = request.Priority;
            communication.CommunicationDate = request.CommunicationDate;
            communication.FollowUpDate = request.FollowUpDate;
            communication.Notes = request.Notes;
            communication.IsRead = request.IsRead;
            communication.Tags = request.Tags;
            communication.ClientId = request.ClientId;
            communication.LeadId = request.LeadId;
            communication.Duration = request.Duration;
            communication.Location = request.Location;
            communication.Attendees = request.Attendees;
            communication.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var communicationDto = await _context.Communications
                .Include(c => c.Client)
                .Include(c => c.Lead)
                .Include(c => c.User)
                .Where(c => c.Id == communication.Id)
                .Select(c => new CommunicationDto(
                    c.Id,
                    c.Type,
                    c.Subject,
                    c.Content,
                    c.Direction,
                    c.Status,
                    c.Priority,
                    c.CommunicationDate,
                    c.FollowUpDate,
                    c.Notes,
                    c.IsRead,
                    c.Tags,
                    c.CreatedAt,
                    c.UpdatedAt,
                    c.ClientId,
                    c.Client != null ? $"{c.Client.FirstName} {c.Client.LastName}" : null,
                    c.LeadId,
                    c.Lead != null ? $"{c.Lead.FirstName} {c.Lead.LastName}" : null,
                    c.UserId,
                    $"{c.User!.FirstName} {c.User.LastName}",
                    c.Duration,
                    c.Location,
                    c.Attendees
                ))
                .FirstAsync();

            return Ok(communicationDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating the communication", error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCommunication(int id)
    {
        try
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            var communication = await _context.Communications
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == currentUserId);

            if (communication == null)
                return NotFound();

            _context.Communications.Remove(communication);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while deleting the communication", error = ex.Message });
        }
    }

    [HttpPost("mark-as-read")]
    public async Task<IActionResult> MarkAsRead([FromBody] MarkAsReadRequest request)
    {
        try
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            var communications = await _context.Communications
                .Where(c => request.CommunicationIds.Contains(c.Id) && c.UserId == currentUserId)
                .ToListAsync();

            foreach (var communication in communications)
            {
                communication.IsRead = true;
                communication.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = $"Marked {communications.Count} communications as read" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while marking communications as read", error = ex.Message });
        }
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetCommunicationStats()
    {
        try
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            var totalMessages = await _context.Communications
                .Where(c => c.UserId == currentUserId)
                .CountAsync();

            var unreadMessages = await _context.Communications
                .Where(c => c.UserId == currentUserId && !c.IsRead)
                .CountAsync();

            var followUpsDue = await _context.Communications
                .Where(c => c.UserId == currentUserId && 
                           c.FollowUpDate.HasValue && 
                           c.FollowUpDate.Value.Date <= DateTime.UtcNow.Date)
                .CountAsync();

            var emailsSent = await _context.Communications
                .Where(c => c.UserId == currentUserId && c.Type == "Email" && c.Direction == "Outbound")
                .CountAsync();

            var callsMade = await _context.Communications
                .Where(c => c.UserId == currentUserId && c.Type == "Call")
                .CountAsync();

            var meetingsScheduled = await _context.Communications
                .Where(c => c.UserId == currentUserId && c.Type == "Meeting")
                .CountAsync();

            // Calculate response rate (simplified)
            var outboundMessages = await _context.Communications
                .Where(c => c.UserId == currentUserId && c.Direction == "Outbound")
                .CountAsync();

            var inboundMessages = await _context.Communications
                .Where(c => c.UserId == currentUserId && c.Direction == "Inbound")
                .CountAsync();

            var responseRate = outboundMessages > 0 ? (double)inboundMessages / outboundMessages * 100 : 0;

            var stats = new CommunicationStatsDto(
                totalMessages,
                unreadMessages,
                followUpsDue,
                Math.Round(responseRate, 1),
                emailsSent,
                callsMade,
                meetingsScheduled
            );

            return Ok(stats);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching communication stats", error = ex.Message });
        }
    }

    [HttpGet("follow-ups")]
    public async Task<IActionResult> GetFollowUps([FromQuery] int days = 7)
    {
        try
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            var endDate = DateTime.UtcNow.AddDays(days);

            var followUps = await _context.Communications
                .Include(c => c.Client)
                .Include(c => c.Lead)
                .Where(c => c.UserId == currentUserId && 
                           c.FollowUpDate.HasValue && 
                           c.FollowUpDate.Value.Date <= endDate.Date)
                .OrderBy(c => c.FollowUpDate)
                .Select(c => new FollowUpDto(
                    c.Id,
                    c.Type,
                    c.Subject,
                    c.FollowUpDate!.Value,
                    c.Priority,
                    c.ClientId,
                    c.Client != null ? $"{c.Client.FirstName} {c.Client.LastName}" : null,
                    c.LeadId,
                    c.Lead != null ? $"{c.Lead.FirstName} {c.Lead.LastName}" : null
                ))
                .ToListAsync();

            return Ok(followUps);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching follow-ups", error = ex.Message });
        }
    }
} 