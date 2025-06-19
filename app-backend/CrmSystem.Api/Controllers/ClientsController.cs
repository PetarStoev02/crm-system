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
public class ClientsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ClientsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetClients(
        [FromQuery] string? search = null,
        [FromQuery] string? status = null,
        [FromQuery] string? type = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            var query = _context.Clients
                .Include(c => c.AssignedToUser)
                .Where(c => c.AssignedToUserId == currentUserId);

            // Apply filters
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(c => 
                    c.FirstName.Contains(search) ||
                    c.LastName.Contains(search) ||
                    c.Company.Contains(search) ||
                    c.Email.Contains(search));
            }

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(c => c.Status == status);
            }

            if (!string.IsNullOrEmpty(type))
            {
                query = query.Where(c => c.Type == type);
            }

            var totalCount = await query.CountAsync();
            var clients = await query
                .OrderByDescending(c => c.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new ClientDto(
                    c.Id,
                    c.FirstName,
                    c.LastName,
                    c.Company,
                    c.Email,
                    c.Phone,
                    c.Address,
                    c.City,
                    c.State,
                    c.PostalCode,
                    c.Country,
                    c.Status,
                    c.Type,
                    c.TotalValue,
                    c.OutstandingBalance,
                    c.Notes,
                    c.CreatedAt,
                    c.LastInvoiceDate,
                    c.AssignedToUserId,
                    $"{c.AssignedToUser!.FirstName} {c.AssignedToUser.LastName}"
                ))
                .ToListAsync();

            var response = new ClientsResponse(
                clients,
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
            return StatusCode(500, new { message = "An error occurred while fetching clients", error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetClient(int id)
    {
        try
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            var client = await _context.Clients
                .Include(c => c.AssignedToUser)
                .FirstOrDefaultAsync(c => c.Id == id && c.AssignedToUserId == currentUserId);

            if (client == null)
                return NotFound();

            var clientDto = new ClientDto(
                client.Id,
                client.FirstName,
                client.LastName,
                client.Company,
                client.Email,
                client.Phone,
                client.Address,
                client.City,
                client.State,
                client.PostalCode,
                client.Country,
                client.Status,
                client.Type,
                client.TotalValue,
                client.OutstandingBalance,
                client.Notes,
                client.CreatedAt,
                client.LastInvoiceDate,
                client.AssignedToUserId,
                $"{client.AssignedToUser!.FirstName} {client.AssignedToUser.LastName}"
            );

            return Ok(clientDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching the client", error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateClient([FromBody] CreateClientRequest request)
    {
        try
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            var client = new Client
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Company = request.Company,
                Email = request.Email,
                Phone = request.Phone,
                Address = request.Address,
                City = request.City,
                State = request.State,
                PostalCode = request.PostalCode,
                Country = request.Country,
                Status = request.Status,
                Type = request.Type,
                Notes = request.Notes,
                AssignedToUserId = currentUserId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            var clientDto = await _context.Clients
                .Include(c => c.AssignedToUser)
                .Where(c => c.Id == client.Id)
                .Select(c => new ClientDto(
                    c.Id,
                    c.FirstName,
                    c.LastName,
                    c.Company,
                    c.Email,
                    c.Phone,
                    c.Address,
                    c.City,
                    c.State,
                    c.PostalCode,
                    c.Country,
                    c.Status,
                    c.Type,
                    c.TotalValue,
                    c.OutstandingBalance,
                    c.Notes,
                    c.CreatedAt,
                    c.LastInvoiceDate,
                    c.AssignedToUserId,
                    $"{c.AssignedToUser!.FirstName} {c.AssignedToUser.LastName}"
                ))
                .FirstAsync();

            return CreatedAtAction(nameof(GetClient), new { id = client.Id }, clientDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while creating the client", error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateClient(int id, [FromBody] UpdateClientRequest request)
    {
        try
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            var client = await _context.Clients
                .FirstOrDefaultAsync(c => c.Id == id && c.AssignedToUserId == currentUserId);

            if (client == null)
                return NotFound();

            client.FirstName = request.FirstName;
            client.LastName = request.LastName;
            client.Company = request.Company;
            client.Email = request.Email;
            client.Phone = request.Phone;
            client.Address = request.Address;
            client.City = request.City;
            client.State = request.State;
            client.PostalCode = request.PostalCode;
            client.Country = request.Country;
            client.Status = request.Status;
            client.Type = request.Type;
            client.Notes = request.Notes;

            await _context.SaveChangesAsync();

            var clientDto = await _context.Clients
                .Include(c => c.AssignedToUser)
                .Where(c => c.Id == client.Id)
                .Select(c => new ClientDto(
                    c.Id,
                    c.FirstName,
                    c.LastName,
                    c.Company,
                    c.Email,
                    c.Phone,
                    c.Address,
                    c.City,
                    c.State,
                    c.PostalCode,
                    c.Country,
                    c.Status,
                    c.Type,
                    c.TotalValue,
                    c.OutstandingBalance,
                    c.Notes,
                    c.CreatedAt,
                    c.LastInvoiceDate,
                    c.AssignedToUserId,
                    $"{c.AssignedToUser!.FirstName} {c.AssignedToUser.LastName}"
                ))
                .FirstAsync();

            return Ok(clientDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating the client", error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteClient(int id)
    {
        try
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            var client = await _context.Clients
                .FirstOrDefaultAsync(c => c.Id == id && c.AssignedToUserId == currentUserId);

            if (client == null)
                return NotFound();

            _context.Clients.Remove(client);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while deleting the client", error = ex.Message });
        }
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetClientStats()
    {
        try
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            var totalClients = await _context.Clients
                .Where(c => c.AssignedToUserId == currentUserId)
                .CountAsync();

            var activeClients = await _context.Clients
                .Where(c => c.AssignedToUserId == currentUserId && c.Status == "Active")
                .CountAsync();

            var prospectClients = await _context.Clients
                .Where(c => c.AssignedToUserId == currentUserId && c.Status == "Prospect")
                .CountAsync();

            var totalRevenue = await _context.Clients
                .Where(c => c.AssignedToUserId == currentUserId)
                .SumAsync(c => c.TotalValue);

            var outstandingAmount = await _context.Clients
                .Where(c => c.AssignedToUserId == currentUserId)
                .SumAsync(c => c.OutstandingBalance);

            var overdueInvoices = await _context.Invoices
                .Where(i => i.CreatedByUserId == currentUserId && 
                           i.Status != "Paid" && 
                           i.DueDate < DateTime.UtcNow)
                .CountAsync();

            var stats = new ClientStatsDto(
                totalClients,
                activeClients,
                prospectClients,
                totalRevenue,
                outstandingAmount,
                overdueInvoices
            );

            return Ok(stats);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching client stats", error = ex.Message });
        }
    }
} 