using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using CrmSystem.Infrastructure.Data;
using CrmSystem.Core.Entities;
using CrmSystem.Application.DTOs;
using Task = CrmSystem.Core.Entities.Task;

namespace CrmSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<TasksController> _logger;

    public TasksController(AppDbContext context, ILogger<TasksController> logger)
    {
        _context = context;
        _logger = logger;
    }

    private string GetCurrentUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
    }

    [HttpGet]
    public async Task<ActionResult<TasksResponse>> GetTasks(
        [FromQuery] string? search,
        [FromQuery] string? status,
        [FromQuery] string? priority,
        [FromQuery] DateTime? dueDateFrom,
        [FromQuery] DateTime? dueDateTo,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            var query = _context.Tasks
                .Include(t => t.AssignedToUser)
                .Include(t => t.RelatedLead)
                .Include(t => t.RelatedCampaign)
                .Where(t => t.AssignedToUserId == currentUserId);

            // Apply filters
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(t => t.Title.Contains(search) || t.Description.Contains(search));
            }

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(t => t.Status == status);
            }

            if (!string.IsNullOrEmpty(priority))
            {
                query = query.Where(t => t.Priority == priority);
            }

            if (dueDateFrom.HasValue)
            {
                query = query.Where(t => t.DueDate >= dueDateFrom.Value);
            }

            if (dueDateTo.HasValue)
            {
                query = query.Where(t => t.DueDate <= dueDateTo.Value);
            }

            var totalCount = await query.CountAsync();
            var totalTasks = await _context.Tasks.Where(t => t.AssignedToUserId == currentUserId).CountAsync();

            var tasks = await query
                .OrderBy(t => t.DueDate)
                .ThenBy(t => t.Priority == "High" ? 1 : t.Priority == "Medium" ? 2 : 3)
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(t => new TaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status,
                    Priority = t.Priority,
                    DueDate = t.DueDate,
                    CreatedAt = t.CreatedAt,
                    CompletedAt = t.CompletedAt,
                    AssignedToUserId = t.AssignedToUserId,
                    AssignedToUser = t.AssignedToUser != null ? new UserDto
                    {
                        FirstName = t.AssignedToUser.FirstName,
                        LastName = t.AssignedToUser.LastName
                    } : null,
                    RelatedLeadId = t.RelatedLeadId,
                    RelatedLead = t.RelatedLead != null ? new RelatedEntityDto
                    {
                        Id = t.RelatedLead.Id,
                        Name = $"{t.RelatedLead.FirstName} {t.RelatedLead.LastName}",
                        Type = "Lead"
                    } : null,
                    RelatedCampaignId = t.RelatedCampaignId,
                    RelatedCampaign = t.RelatedCampaign != null ? new RelatedEntityDto
                    {
                        Id = t.RelatedCampaign.Id,
                        Name = t.RelatedCampaign.Name,
                        Type = "Campaign"
                    } : null
                })
                .ToListAsync();

            var response = new TasksResponse
            {
                Tasks = tasks,
                TotalCount = totalCount,
                TotalTasks = totalTasks,
                Page = page,
                Limit = limit,
                TotalPages = (int)Math.Ceiling((double)totalCount / limit)
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tasks");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskDto>> GetTask(int id)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            var task = await _context.Tasks
                .Include(t => t.AssignedToUser)
                .Include(t => t.RelatedLead)
                .Include(t => t.RelatedCampaign)
                .FirstOrDefaultAsync(t => t.Id == id && t.AssignedToUserId == currentUserId);

            if (task == null)
            {
                return NotFound();
            }

            return Ok(new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                Priority = task.Priority,
                DueDate = task.DueDate,
                CreatedAt = task.CreatedAt,
                CompletedAt = task.CompletedAt,
                AssignedToUserId = task.AssignedToUserId,
                AssignedToUser = task.AssignedToUser != null ? new UserDto
                {
                    FirstName = task.AssignedToUser.FirstName,
                    LastName = task.AssignedToUser.LastName
                } : null,
                RelatedLeadId = task.RelatedLeadId,
                RelatedLead = task.RelatedLead != null ? new RelatedEntityDto
                {
                    Id = task.RelatedLead.Id,
                    Name = $"{task.RelatedLead.FirstName} {task.RelatedLead.LastName}",
                    Type = "Lead"
                } : null,
                RelatedCampaignId = task.RelatedCampaignId,
                RelatedCampaign = task.RelatedCampaign != null ? new RelatedEntityDto
                {
                    Id = task.RelatedCampaign.Id,
                    Name = task.RelatedCampaign.Name,
                    Type = "Campaign"
                } : null
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving task {TaskId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    public async Task<ActionResult<TaskDto>> CreateTask([FromBody] CreateTaskRequest request)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            
            var task = new Task
            {
                Title = request.Title,
                Description = request.Description ?? string.Empty,
                Status = request.Status ?? "Pending",
                Priority = request.Priority ?? "Medium",
                DueDate = request.DueDate,
                AssignedToUserId = currentUserId,
                CreatedByUserId = currentUserId,
                RelatedLeadId = request.RelatedLeadId,
                RelatedCampaignId = request.RelatedCampaignId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            // Load the created task with user info
            var createdTask = await _context.Tasks
                .Include(t => t.AssignedToUser)
                .Include(t => t.RelatedLead)
                .Include(t => t.RelatedCampaign)
                .FirstOrDefaultAsync(t => t.Id == task.Id);

            var response = new TaskDto
            {
                Id = createdTask!.Id,
                Title = createdTask.Title,
                Description = createdTask.Description,
                Status = createdTask.Status,
                Priority = createdTask.Priority,
                DueDate = createdTask.DueDate,
                CreatedAt = createdTask.CreatedAt,
                CompletedAt = createdTask.CompletedAt,
                AssignedToUserId = createdTask.AssignedToUserId,
                AssignedToUser = createdTask.AssignedToUser != null ? new UserDto
                {
                    FirstName = createdTask.AssignedToUser.FirstName,
                    LastName = createdTask.AssignedToUser.LastName
                } : null,
                RelatedLeadId = createdTask.RelatedLeadId,
                RelatedLead = createdTask.RelatedLead != null ? new RelatedEntityDto
                {
                    Id = createdTask.RelatedLead.Id,
                    Name = $"{createdTask.RelatedLead.FirstName} {createdTask.RelatedLead.LastName}",
                    Type = "Lead"
                } : null,
                RelatedCampaignId = createdTask.RelatedCampaignId,
                RelatedCampaign = createdTask.RelatedCampaign != null ? new RelatedEntityDto
                {
                    Id = createdTask.RelatedCampaign.Id,
                    Name = createdTask.RelatedCampaign.Name,
                    Type = "Campaign"
                } : null
            };

            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating task");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TaskDto>> UpdateTask(int id, [FromBody] UpdateTaskRequest request)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == id && t.AssignedToUserId == currentUserId);

            if (task == null)
            {
                return NotFound();
            }

            // Update fields if provided
            if (!string.IsNullOrEmpty(request.Title))
                task.Title = request.Title;
            
            if (request.Description != null)
                task.Description = request.Description;
            
            if (!string.IsNullOrEmpty(request.Status))
            {
                task.Status = request.Status;
                if (request.Status == "Completed" && task.CompletedAt == null)
                {
                    task.CompletedAt = DateTime.UtcNow;
                }
                else if (request.Status != "Completed")
                {
                    task.CompletedAt = null;
                }
            }
            
            if (!string.IsNullOrEmpty(request.Priority))
                task.Priority = request.Priority;
            
            if (request.DueDate.HasValue)
                task.DueDate = request.DueDate.Value;

            if (request.RelatedLeadId.HasValue)
                task.RelatedLeadId = request.RelatedLeadId.Value;

            if (request.RelatedCampaignId.HasValue)
                task.RelatedCampaignId = request.RelatedCampaignId.Value;

            await _context.SaveChangesAsync();

            // Return updated task with user info
            var updatedTask = await _context.Tasks
                .Include(t => t.AssignedToUser)
                .Include(t => t.RelatedLead)
                .Include(t => t.RelatedCampaign)
                .FirstOrDefaultAsync(t => t.Id == id);

            var response = new TaskDto
            {
                Id = updatedTask!.Id,
                Title = updatedTask.Title,
                Description = updatedTask.Description,
                Status = updatedTask.Status,
                Priority = updatedTask.Priority,
                DueDate = updatedTask.DueDate,
                CreatedAt = updatedTask.CreatedAt,
                CompletedAt = updatedTask.CompletedAt,
                AssignedToUserId = updatedTask.AssignedToUserId,
                AssignedToUser = updatedTask.AssignedToUser != null ? new UserDto
                {
                    FirstName = updatedTask.AssignedToUser.FirstName,
                    LastName = updatedTask.AssignedToUser.LastName
                } : null,
                RelatedLeadId = updatedTask.RelatedLeadId,
                RelatedLead = updatedTask.RelatedLead != null ? new RelatedEntityDto
                {
                    Id = updatedTask.RelatedLead.Id,
                    Name = $"{updatedTask.RelatedLead.FirstName} {updatedTask.RelatedLead.LastName}",
                    Type = "Lead"
                } : null,
                RelatedCampaignId = updatedTask.RelatedCampaignId,
                RelatedCampaign = updatedTask.RelatedCampaign != null ? new RelatedEntityDto
                {
                    Id = updatedTask.RelatedCampaign.Id,
                    Name = updatedTask.RelatedCampaign.Name,
                    Type = "Campaign"
                } : null
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating task {TaskId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTask(int id)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == id && t.AssignedToUserId == currentUserId);

            if (task == null)
            {
                return NotFound();
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting task {TaskId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPatch("{id}/status")]
    public async Task<ActionResult<TaskDto>> UpdateTaskStatus(int id, [FromBody] UpdateTaskStatusRequest request)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == id && t.AssignedToUserId == currentUserId);

            if (task == null)
            {
                return NotFound();
            }

            task.Status = request.Status;
            if (request.Status == "Completed" && task.CompletedAt == null)
            {
                task.CompletedAt = DateTime.UtcNow;
            }
            else if (request.Status != "Completed")
            {
                task.CompletedAt = null;
            }

            await _context.SaveChangesAsync();

            // Return updated task
            var updatedTask = await _context.Tasks
                .Include(t => t.AssignedToUser)
                .Include(t => t.RelatedLead)
                .Include(t => t.RelatedCampaign)
                .FirstOrDefaultAsync(t => t.Id == id);

            var response = new TaskDto
            {
                Id = updatedTask!.Id,
                Title = updatedTask.Title,
                Description = updatedTask.Description,
                Status = updatedTask.Status,
                Priority = updatedTask.Priority,
                DueDate = updatedTask.DueDate,
                CreatedAt = updatedTask.CreatedAt,
                CompletedAt = updatedTask.CompletedAt,
                AssignedToUserId = updatedTask.AssignedToUserId,
                AssignedToUser = updatedTask.AssignedToUser != null ? new UserDto
                {
                    FirstName = updatedTask.AssignedToUser.FirstName,
                    LastName = updatedTask.AssignedToUser.LastName
                } : null,
                RelatedLeadId = updatedTask.RelatedLeadId,
                RelatedLead = updatedTask.RelatedLead != null ? new RelatedEntityDto
                {
                    Id = updatedTask.RelatedLead.Id,
                    Name = $"{updatedTask.RelatedLead.FirstName} {updatedTask.RelatedLead.LastName}",
                    Type = "Lead"
                } : null,
                RelatedCampaignId = updatedTask.RelatedCampaignId,
                RelatedCampaign = updatedTask.RelatedCampaign != null ? new RelatedEntityDto
                {
                    Id = updatedTask.RelatedCampaign.Id,
                    Name = updatedTask.RelatedCampaign.Name,
                    Type = "Campaign"
                } : null
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating task status {TaskId}", id);
            return StatusCode(500, "Internal server error");
        }
    }
} 