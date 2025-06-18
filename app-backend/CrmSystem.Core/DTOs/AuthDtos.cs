namespace CrmSystem.Core.DTOs;

public record LoginRequest(string Email, string Password);

public record LoginResponse(
    string Token,
    string Email,
    string FirstName,
    string LastName,
    DateTime ExpiresAt
);

public record RegisterRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName
); 