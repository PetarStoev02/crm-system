namespace CrmSystem.Core.DTOs;

// Communication DTOs
public record CommunicationDto(
    int Id,
    string Type,
    string Subject,
    string Content,
    string Direction,
    string Status,
    string Priority,
    DateTime CommunicationDate,
    DateTime? FollowUpDate,
    string Notes,
    bool IsRead,
    string Tags,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    int? ClientId,
    string? ClientName,
    int? LeadId,
    string? LeadName,
    string UserId,
    string UserName,
    string? Duration,
    string? Location,
    string? Attendees
);

public record CreateCommunicationRequest(
    string Type,
    string Subject,
    string Content,
    string Direction,
    string Status,
    string Priority,
    DateTime CommunicationDate,
    DateTime? FollowUpDate,
    string Notes,
    string Tags,
    int? ClientId,
    int? LeadId,
    string? Duration,
    string? Location,
    string? Attendees
);

public record UpdateCommunicationRequest(
    string Type,
    string Subject,
    string Content,
    string Direction,
    string Status,
    string Priority,
    DateTime CommunicationDate,
    DateTime? FollowUpDate,
    string Notes,
    bool IsRead,
    string Tags,
    int? ClientId,
    int? LeadId,
    string? Duration,
    string? Location,
    string? Attendees
);

public record CommunicationsResponse(
    List<CommunicationDto> Communications,
    int TotalCount,
    int Page,
    int PageSize,
    bool HasNextPage,
    bool HasPreviousPage
);

public record CommunicationStatsDto(
    int TotalMessages,
    int UnreadMessages,
    int FollowUpsDue,
    double ResponseRate,
    int EmailsSent,
    int CallsMade,
    int MeetingsScheduled
);

public record MarkAsReadRequest(
    List<int> CommunicationIds
);

public record FollowUpDto(
    int Id,
    string Type,
    string Subject,
    DateTime FollowUpDate,
    string Priority,
    int? ClientId,
    string? ClientName,
    int? LeadId,
    string? LeadName
); 