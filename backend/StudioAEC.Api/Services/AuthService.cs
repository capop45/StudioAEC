using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using StudioAEC.Api.Models;

namespace StudioAEC.Api.Services;

/// <summary>
/// Authenticates demo users against BCrypt-hashed credentials and issues JWT tokens.
/// Real deployments must replace the in-memory store by a persistent user repository.
/// </summary>
public class AuthService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;

    private record UserRecord(string PasswordHash, string Name, string Role);

    private readonly Dictionary<string, UserRecord> _users;

    public AuthService(IConfiguration configuration, ILogger<AuthService> logger)
    {
        _configuration = configuration;
        _logger = logger;

        _users = new Dictionary<string, UserRecord>(StringComparer.OrdinalIgnoreCase)
        {
            ["aluno@estudioaec.com"] = new(BCrypt.Net.BCrypt.HashPassword("aluno123", 11), "Aluno Demo", "Student"),
            ["admin@estudioaec.com"] = new(BCrypt.Net.BCrypt.HashPassword("admin123", 11), "Administrador", "Admin")
        };
    }

    public LoginResponse? Authenticate(LoginRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        if (!_users.TryGetValue(email, out var user))
        {
            // Constant-time dummy verify para mitigar enumeração por tempo.
            BCrypt.Net.BCrypt.Verify(request.Password, "$2a$11$abcdefghijklmnopqrstuvabcdefghijklmnopqrstuvabcdefghij");
            _logger.LogInformation("Login attempt for unknown user.");
            return null;
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            _logger.LogInformation("Login failure (bad password) for {Email}", email);
            return null;
        }

        var token = GenerateToken(email, user.Name, user.Role);
        return new LoginResponse(token, user.Name, email, user.Role);
    }

    private string GenerateToken(string email, string name, string role)
    {
        var rawKey = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("Jwt:Key não configurada.");
        if (Encoding.UTF8.GetByteCount(rawKey) < 32)
        {
            throw new InvalidOperationException(
                "Jwt:Key inválida: a chave HMAC-SHA256 precisa de pelo menos 32 bytes.");
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(rawKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, email),
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Name, name),
            new Claim(ClaimTypes.Role, role)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"] ?? "StudioAEC",
            audience: _configuration["Jwt:Audience"] ?? "StudioAEC",
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
