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
public class InvoicesController : ControllerBase
{
    private readonly AppDbContext _context;

    public InvoicesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetInvoices(
        [FromQuery] string? search = null,
        [FromQuery] string? status = null,
        [FromQuery] int? clientId = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            var query = _context.Invoices
                .Include(i => i.Client)
                .Include(i => i.Items)
                .Where(i => i.CreatedByUserId == currentUserId);

            // Apply filters
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(i => 
                    i.InvoiceNumber.Contains(search) ||
                    i.Client!.FirstName.Contains(search) ||
                    i.Client.LastName.Contains(search) ||
                    i.Client.Company.Contains(search));
            }

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(i => i.Status == status);
            }

            if (clientId.HasValue)
            {
                query = query.Where(i => i.ClientId == clientId.Value);
            }

            var totalCount = await query.CountAsync();
            var invoices = await query
                .OrderByDescending(i => i.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(i => new InvoiceDto(
                    i.Id,
                    i.InvoiceNumber,
                    i.ClientId,
                    $"{i.Client!.FirstName} {i.Client.LastName}",
                    i.IssueDate,
                    i.DueDate,
                    i.Status,
                    i.SubTotal,
                    i.TaxRate,
                    i.TaxAmount,
                    i.Total,
                    i.AmountPaid,
                    i.AmountDue,
                    i.Currency,
                    i.Notes,
                    i.Terms,
                    i.PaidDate,
                    i.PaymentMethod,
                    i.CreatedAt,
                    i.CreatedByUserId,
                    i.Items.Select(item => new InvoiceItemDto(
                        item.Id,
                        item.Description,
                        item.Quantity,
                        item.UnitPrice,
                        item.Total,
                        item.SortOrder
                    )).ToList()
                ))
                .ToListAsync();

            var response = new InvoicesResponse(
                invoices,
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
            return StatusCode(500, new { message = "An error occurred while fetching invoices", error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetInvoice(int id)
    {
        try
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            var invoice = await _context.Invoices
                .Include(i => i.Client)
                .Include(i => i.Items)
                .FirstOrDefaultAsync(i => i.Id == id && i.CreatedByUserId == currentUserId);

            if (invoice == null)
                return NotFound();

            var invoiceDto = new InvoiceDto(
                invoice.Id,
                invoice.InvoiceNumber,
                invoice.ClientId,
                $"{invoice.Client!.FirstName} {invoice.Client.LastName}",
                invoice.IssueDate,
                invoice.DueDate,
                invoice.Status,
                invoice.SubTotal,
                invoice.TaxRate,
                invoice.TaxAmount,
                invoice.Total,
                invoice.AmountPaid,
                invoice.AmountDue,
                invoice.Currency,
                invoice.Notes,
                invoice.Terms,
                invoice.PaidDate,
                invoice.PaymentMethod,
                invoice.CreatedAt,
                invoice.CreatedByUserId,
                invoice.Items.Select(item => new InvoiceItemDto(
                    item.Id,
                    item.Description,
                    item.Quantity,
                    item.UnitPrice,
                    item.Total,
                    item.SortOrder
                )).ToList()
            );

            return Ok(invoiceDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching the invoice", error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateInvoice([FromBody] CreateInvoiceRequest request)
    {
        try
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            // Verify client exists and belongs to user
            var client = await _context.Clients
                .FirstOrDefaultAsync(c => c.Id == request.ClientId && c.AssignedToUserId == currentUserId);

            if (client == null)
                return BadRequest("Client not found or access denied");

            // Generate invoice number
            var invoiceCount = await _context.Invoices.CountAsync() + 1;
            var invoiceNumber = $"INV-{DateTime.Now.Year}-{invoiceCount:D4}";

            // Calculate totals
            var subTotal = request.Items.Sum(item => item.Quantity * item.UnitPrice);
            var taxAmount = subTotal * (request.TaxRate / 100);
            var total = subTotal + taxAmount;

            var invoice = new Invoice
            {
                InvoiceNumber = invoiceNumber,
                ClientId = request.ClientId,
                DueDate = request.DueDate,
                TaxRate = request.TaxRate,
                TaxAmount = taxAmount,
                SubTotal = subTotal,
                Total = total,
                AmountDue = total,
                Notes = request.Notes,
                Terms = request.Terms,
                CreatedByUserId = currentUserId,
                CreatedAt = DateTime.UtcNow,
                IssueDate = DateTime.UtcNow
            };

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            // Add invoice items
            var items = request.Items.Select((item, index) => new InvoiceItem
            {
                InvoiceId = invoice.Id,
                Description = item.Description,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                Total = item.Quantity * item.UnitPrice,
                SortOrder = index
            }).ToList();

            _context.InvoiceItems.AddRange(items);
            await _context.SaveChangesAsync();

            // Update client totals
            await UpdateClientTotals(request.ClientId);

            var invoiceDto = await GetInvoiceDto(invoice.Id);
            return CreatedAtAction(nameof(GetInvoice), new { id = invoice.Id }, invoiceDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while creating the invoice", error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateInvoice(int id, [FromBody] UpdateInvoiceRequest request)
    {
        try
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            var invoice = await _context.Invoices
                .Include(i => i.Items)
                .FirstOrDefaultAsync(i => i.Id == id && i.CreatedByUserId == currentUserId);

            if (invoice == null)
                return NotFound();

            // Update invoice properties
            invoice.DueDate = request.DueDate;
            invoice.Status = request.Status;
            invoice.TaxRate = request.TaxRate;
            invoice.Notes = request.Notes;
            invoice.Terms = request.Terms;

            // Remove existing items
            _context.InvoiceItems.RemoveRange(invoice.Items);

            // Add updated items
            var newItems = request.Items.Select((item, index) => new InvoiceItem
            {
                InvoiceId = invoice.Id,
                Description = item.Description,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                Total = item.Quantity * item.UnitPrice,
                SortOrder = index
            }).ToList();

            _context.InvoiceItems.AddRange(newItems);

            // Recalculate totals
            var subTotal = newItems.Sum(item => item.Total);
            var taxAmount = subTotal * (request.TaxRate / 100);
            var total = subTotal + taxAmount;

            invoice.SubTotal = subTotal;
            invoice.TaxAmount = taxAmount;
            invoice.Total = total;
            invoice.AmountDue = total - invoice.AmountPaid;

            await _context.SaveChangesAsync();

            // Update client totals
            await UpdateClientTotals(invoice.ClientId);

            var invoiceDto = await GetInvoiceDto(invoice.Id);
            return Ok(invoiceDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating the invoice", error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInvoice(int id)
    {
        try
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            var invoice = await _context.Invoices
                .FirstOrDefaultAsync(i => i.Id == id && i.CreatedByUserId == currentUserId);

            if (invoice == null)
                return NotFound();

            var clientId = invoice.ClientId;
            _context.Invoices.Remove(invoice);
            await _context.SaveChangesAsync();

            // Update client totals
            await UpdateClientTotals(clientId);

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while deleting the invoice", error = ex.Message });
        }
    }

    [HttpPost("{id}/pay")]
    public async Task<IActionResult> PayInvoice(int id, [FromBody] PayInvoiceRequest request)
    {
        try
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            var invoice = await _context.Invoices
                .FirstOrDefaultAsync(i => i.Id == id && i.CreatedByUserId == currentUserId);

            if (invoice == null)
                return NotFound();

            invoice.AmountPaid += request.AmountPaid;
            invoice.AmountDue = invoice.Total - invoice.AmountPaid;
            invoice.PaymentMethod = request.PaymentMethod;

            if (request.PaidDate.HasValue)
                invoice.PaidDate = request.PaidDate.Value;

            // Update status based on payment
            if (invoice.AmountDue <= 0)
            {
                invoice.Status = "Paid";
                invoice.PaidDate = request.PaidDate ?? DateTime.UtcNow;
            }
            else if (invoice.AmountPaid > 0)
            {
                invoice.Status = "Partially Paid";
            }

            await _context.SaveChangesAsync();

            // Update client totals
            await UpdateClientTotals(invoice.ClientId);

            var invoiceDto = await GetInvoiceDto(invoice.Id);
            return Ok(invoiceDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while processing payment", error = ex.Message });
        }
    }

    private async System.Threading.Tasks.Task UpdateClientTotals(int clientId)
    {
        var client = await _context.Clients.FindAsync(clientId);
        if (client != null)
        {
            var clientInvoices = await _context.Invoices
                .Where(i => i.ClientId == clientId)
                .ToListAsync();

            client.TotalValue = clientInvoices.Sum(i => i.Total);
            client.OutstandingBalance = clientInvoices.Sum(i => i.AmountDue);
            client.LastInvoiceDate = clientInvoices.Max(i => (DateTime?)i.CreatedAt);

            await _context.SaveChangesAsync();
        }
    }

    private async System.Threading.Tasks.Task<InvoiceDto> GetInvoiceDto(int invoiceId)
    {
        var invoice = await _context.Invoices
            .Include(i => i.Client)
            .Include(i => i.Items)
            .FirstAsync(i => i.Id == invoiceId);

        return new InvoiceDto(
            invoice.Id,
            invoice.InvoiceNumber,
            invoice.ClientId,
            $"{invoice.Client!.FirstName} {invoice.Client.LastName}",
            invoice.IssueDate,
            invoice.DueDate,
            invoice.Status,
            invoice.SubTotal,
            invoice.TaxRate,
            invoice.TaxAmount,
            invoice.Total,
            invoice.AmountPaid,
            invoice.AmountDue,
            invoice.Currency,
            invoice.Notes,
            invoice.Terms,
            invoice.PaidDate,
            invoice.PaymentMethod,
            invoice.CreatedAt,
            invoice.CreatedByUserId,
            invoice.Items.Select(item => new InvoiceItemDto(
                item.Id,
                item.Description,
                item.Quantity,
                item.UnitPrice,
                item.Total,
                item.SortOrder
            )).ToList()
        );
    }
} 