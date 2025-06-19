namespace CrmSystem.Core.DTOs;

// Client DTOs
public record ClientDto(
    int Id,
    string FirstName,
    string LastName,
    string Company,
    string Email,
    string Phone,
    string Address,
    string City,
    string State,
    string PostalCode,
    string Country,
    string Status,
    string Type,
    decimal TotalValue,
    decimal OutstandingBalance,
    string Notes,
    DateTime CreatedAt,
    DateTime? LastInvoiceDate,
    string AssignedToUserId,
    string AssignedToUserName
);

public record CreateClientRequest(
    string FirstName,
    string LastName,
    string Company,
    string Email,
    string Phone,
    string Address,
    string City,
    string State,
    string PostalCode,
    string Country,
    string Status,
    string Type,
    string Notes
);

public record UpdateClientRequest(
    string FirstName,
    string LastName,
    string Company,
    string Email,
    string Phone,
    string Address,
    string City,
    string State,
    string PostalCode,
    string Country,
    string Status,
    string Type,
    string Notes
);

public record ClientsResponse(
    List<ClientDto> Clients,
    int TotalCount,
    int Page,
    int PageSize,
    bool HasNextPage,
    bool HasPreviousPage
);

public record ClientStatsDto(
    int TotalClients,
    int ActiveClients,
    int ProspectClients,
    decimal TotalRevenue,
    decimal OutstandingAmount,
    int OverdueInvoices
);

// Invoice DTOs
public record InvoiceDto(
    int Id,
    string InvoiceNumber,
    int ClientId,
    string ClientName,
    DateTime IssueDate,
    DateTime DueDate,
    string Status,
    decimal SubTotal,
    decimal TaxRate,
    decimal TaxAmount,
    decimal Total,
    decimal AmountPaid,
    decimal AmountDue,
    string Currency,
    string Notes,
    string Terms,
    DateTime? PaidDate,
    string PaymentMethod,
    DateTime CreatedAt,
    string CreatedByUserId,
    List<InvoiceItemDto> Items
);

public record InvoiceItemDto(
    int Id,
    string Description,
    int Quantity,
    decimal UnitPrice,
    decimal Total,
    int SortOrder
);

public record CreateInvoiceRequest(
    int ClientId,
    DateTime DueDate,
    decimal TaxRate,
    string Notes,
    string Terms,
    List<CreateInvoiceItemRequest> Items
);

public record CreateInvoiceItemRequest(
    string Description,
    int Quantity,
    decimal UnitPrice
);

public record UpdateInvoiceRequest(
    DateTime DueDate,
    string Status,
    decimal TaxRate,
    string Notes,
    string Terms,
    List<UpdateInvoiceItemRequest> Items
);

public record UpdateInvoiceItemRequest(
    int? Id,
    string Description,
    int Quantity,
    decimal UnitPrice
);

public record InvoicesResponse(
    List<InvoiceDto> Invoices,
    int TotalCount,
    int Page,
    int PageSize,
    bool HasNextPage,
    bool HasPreviousPage
);

public record PayInvoiceRequest(
    decimal AmountPaid,
    string PaymentMethod,
    DateTime? PaidDate
); 